import express from 'express';
import cors from 'cors';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import dotenv from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore';
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

app.post('/api/payments/create-preference', async (req, res) => {
  try {
    const { items, orderId, customer, total, desconto } = req.body;

    console.log("--- DEBUG CREATE PREFERENCE ---");
    console.log("1. req.body completo:", req.body);
    console.log("2. orderId:", orderId);
    console.log("3. total recebido:", total);
    console.log("4. desconto recebido:", desconto);
    console.log("5. items recebidos:", items);
    
    if (!process.env.MERCADO_PAGO_ACCESS_TOKEN) {
      console.warn("MERCADO_PAGO_ACCESS_TOKEN não configurado no .env");
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const backendUrl = process.env.BACKEND_URL || "https://gorged-husband-saturday.ngrok-free.dev";

    const orderTotal = Number(total);

    if (isNaN(orderTotal) || orderTotal <= 0) {
      return res.status(400).json({ error: 'O valor do pedido não pode ser zero ou negativo. Certifique-se de enviar o "total" no corpo da requisição.' });
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
        name: customer.name,
        email: customer.email || 'email@exemplo.com',
      },
      back_urls: {
        success: `${frontendUrl}/pagamento/sucesso`,
        failure: `${frontendUrl}/pagamento/erro`,
        pending: `${frontendUrl}/pagamento/pendente`,
      },
      notification_url: `${backendUrl}/api/payments/webhook`,
      external_reference: orderId,
    };

    console.log('6. body final enviado ao Mercado Pago:', JSON.stringify(preferenceBody, null, 2));

    const preference = new Preference(client);
    const result = await preference.create({ body: preferenceBody });

    res.json({ id: result.id, init_point: result.init_point });
  } catch (error) {
    console.error('Erro ao criar preferência no Mercado Pago:', error);
    res.status(500).json({ error: 'Falha ao criar preferência' });
  }
});

app.post('/api/payments/webhook', async (req, res) => {
  console.log("WEBHOOK CHEGOU");
  console.log("Body:", JSON.stringify(req.body, null, 2));
  console.log("Query:", req.query);
  
  try {
    // 1. Identificar o tópico
    const topic = req.query.topic || req.body.topic || req.body.type || req.query.type;

    // 2. Se for merchant_order, apenas logar e ignorar
    if (topic === "merchant_order") {
      console.log("Merchant order recebido, ignorando conforme solicitado.");
      return res.sendStatus(200);
    }

    // 3. Processar apenas eventos de pagamento
    if (topic !== "payment" && topic !== "payment") {
       // Se não for explicitamente payment, mas tivermos data.id, podemos tentar processar
       if (!req.body?.data?.id && !req.query?.id && !req.query["data.id"]) {
         console.log("Tópico desconhecido e sem ID de pagamento, ignorando:", topic);
         return res.sendStatus(200);
       }
    }

    // 4. Pegar paymentId de múltiplas fontes possíveis
    const paymentId = req.body?.data?.id || req.query?.id || req.query["data.id"];

    if (!paymentId || isNaN(Number(paymentId))) {
      console.log('Webhook ignorado: paymentId inválido ou ausente');
      return res.sendStatus(200);
    }

    console.log("Processando Payment ID:", paymentId);

    const payment = new Payment(client);
    const paymentInfo = await payment.get({ id: String(paymentId) });

    console.log("Status do pagamento no MP:", paymentInfo.status);
    console.log("Referência Externa (Pedido ID):", paymentInfo.external_reference);

    const status = paymentInfo.status;
    const orderId = paymentInfo.external_reference;

    if (orderId) {
      const updateData = {
        mercadoPagoStatus: status,
        mercadoPagoPaymentId: String(paymentId),
        atualizadoEm: serverTimestamp()
      };

      let orderStatus = '';

      if (status === 'approved') {
        orderStatus = 'Pago';
        updateData.pagoEm = serverTimestamp();
      } else if (status === 'pending' || status === 'in_process') {
        orderStatus = 'Pendente';
      } else if (status === 'rejected') {
        orderStatus = 'Recusado';
      } else if (status === 'cancelled') {
        orderStatus = 'Cancelado';
      }

      if (orderStatus) {
        updateData.status = orderStatus;
        try {
          const orderRef = doc(db, 'pedidos', orderId);
          await updateDoc(orderRef, updateData);
          console.log("Pedido atualizado com sucesso:", orderId, "Status:", orderStatus);
        } catch (dbError) {
          console.error("ERRO AO ATUALIZAR FIRESTORE:", dbError);
          // Mesmo com erro de banco, retornamos 200 para o MP parar de tentar
        }
      } else {
        console.log("Status não mapeado para atualização de pedido:", status);
      }
    } else {
      console.log("Webhook sem external_reference (orderId), ignorando atualização.");
    }

    return res.sendStatus(200);
  } catch (error) {
    console.error('ERRO NO PROCESSAMENTO DO WEBHOOK:', error);
    return res.sendStatus(200);
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend rodando na porta ${PORT}`);
});
