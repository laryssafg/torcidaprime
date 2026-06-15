import express from 'express';
import cors from 'cors';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import dotenv from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { readFileSync } from 'fs';

dotenv.config();

const firebaseConfig = JSON.parse(readFileSync(new URL('./firebase-applet-config.json', import.meta.url)));
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const app = express();
app.use(cors());
app.use(express.json());

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || ''
});

// ─── CREATE PREFERENCE ────────────────────────────────────────────────────────
app.post('/api/payments/create-preference', async (req, res) => {
  try {
    const { orderId, customer, total } = req.body;

    console.log("--- DEBUG CREATE PREFERENCE ---");
    console.log("orderId:", orderId);
    console.log("total recebido:", total);

    if (!process.env.MERCADO_PAGO_ACCESS_TOKEN) {
      console.warn("MERCADO_PAGO_ACCESS_TOKEN não configurado no .env");
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const backendUrl  = process.env.BACKEND_URL  || 'https://torcidaprime.onrender.com';

    const orderTotal = Number(total);

    if (isNaN(orderTotal) || orderTotal <= 0) {
      return res.status(400).json({ error: 'O valor do pedido não pode ser zero ou negativo.' });
    }

    console.log("Total enviado ao Mercado Pago:", orderTotal);
    console.log("Notification URL:", `${backendUrl}/api/payments/webhook`);

    const preferenceBody = {
      items: [
        {
          title: "Pedido Torcida Prime",
          quantity: 1,
          unit_price: orderTotal,
          currency_id: "BRL"
        }
      ],
      payer: {
        name: customer?.name || 'Cliente',
        email: customer?.email || 'email@exemplo.com',
      },
      back_urls: {
        success: `${frontendUrl}/pagamento/sucesso`,
        failure: `${frontendUrl}/pagamento/erro`,
        pending: `${frontendUrl}/pagamento/pendente`,
      },
      auto_return: "approved",
      notification_url: `${backendUrl}/api/payments/webhook`,
      external_reference: orderId,
    };

    console.log("Body final enviado ao MP:", JSON.stringify(preferenceBody, null, 2));

    const preference = new Preference(client);
    const result = await preference.create({ body: preferenceBody });

    res.json({ id: result.id, init_point: result.init_point });
  } catch (error) {
    console.error('Erro ao criar preferência no Mercado Pago:', error);
    res.status(500).json({ error: 'Falha ao criar preferência' });
  }
});

// ─── WEBHOOK ──────────────────────────────────────────────────────────────────
app.post('/api/payments/webhook', async (req, res) => {
  console.log("=== WEBHOOK CHEGOU ===");
  console.log("Body:", JSON.stringify(req.body, null, 2));
  console.log("Query:", req.query);

  // Responder 200 imediatamente para o MP não reenviar
  res.sendStatus(200);

  try {
    const type  = req.body.type  || req.query.type  || req.body.topic || req.query.topic || '';
    const topic = String(type).toLowerCase();

    // Ignorar merchant_order
    if (topic === 'merchant_order') {
      console.log("Merchant order ignorado.");
      return;
    }

    // Extrair paymentId de todas as fontes possíveis
    const paymentId =
      req.body?.data?.id ||
      req.query['data.id'] ||
      req.query.id ||
      (typeof req.body.resource === 'string' && req.body.resource.includes('/payments/')
        ? req.body.resource.split('/payments/')[1]
        : null);

    console.log("Payment ID:", paymentId);

    if (!paymentId || isNaN(Number(paymentId))) {
      console.log("Webhook ignorado: paymentId inválido ou ausente.");
      return;
    }

    // Buscar pagamento no Mercado Pago
    const payment = new Payment(client);
    const paymentInfo = await payment.get({ id: String(paymentId) });

    const status  = paymentInfo.status;
    const orderId = paymentInfo.external_reference;

    console.log("Status Mercado Pago:", status);
    console.log("Pedido ID:", orderId);

    if (!orderId) {
      console.log("Webhook sem external_reference, ignorando.");
      return;
    }

    // Mapear status MP → status interno
    const statusMap = {
      approved:   'Pago',
      pending:    'Pendente',
      in_process: 'Pendente',
      rejected:   'Recusado',
      cancelled:  'Cancelado',
    };

    const orderStatus = statusMap[status] || null;

    if (!orderStatus) {
      console.log("Status não mapeado:", status);
      return;
    }

    const updateData = {
      status:               orderStatus,
      mercadoPagoStatus:    status,
      mercadoPagoPaymentId: String(paymentId),
      atualizadoEm:         serverTimestamp(),
    };

    if (status === 'approved') {
      updateData.pagoEm = serverTimestamp();
    }

    const orderRef = doc(db, 'pedidos', orderId);
    await updateDoc(orderRef, updateData);

    console.log("Pedido atualizado para", orderStatus + ":", orderId);
  } catch (error) {
    console.error('ERRO NO PROCESSAMENTO DO WEBHOOK:', error);
  }
});

// ─── START ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend rodando na porta ${PORT}`);
});
