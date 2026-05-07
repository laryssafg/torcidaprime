import express from 'express';
import cors from 'cors';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import dotenv from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';
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
    const { items, orderId, customer } = req.body;
    
    if (!process.env.MERCADO_PAGO_ACCESS_TOKEN) {
      console.warn("MERCADO_PAGO_ACCESS_TOKEN não configurado no .env");
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    // Fetch the order from Firestore to get the exact total with discounts
    const orderRef = doc(db, 'pedidos', orderId);
    const orderSnap = await getDoc(orderRef);
    let orderTotal = 0;

    if (orderSnap.exists()) {
      const orderData = orderSnap.data();
      orderTotal = Number(orderData.total) || 0;
    } else {
      // Fallback if order not found for some reason
      orderTotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    }

    if (orderTotal <= 0) {
      return res.status(400).json({ error: 'O valor do pedido não pode ser zero ou negativo.' });
    }

    const preferenceBody = {
      items: [
        {
          id: orderId,
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
      external_reference: orderId,
    };

    console.log('BODY ENVIADO AO MERCADO PAGO:', JSON.stringify(preferenceBody, null, 2));

    const preference = new Preference(client);
    const result = await preference.create({ body: preferenceBody });

    res.json({ id: result.id, init_point: result.init_point });
  } catch (error) {
    console.error('Erro ao criar preferência no Mercado Pago:', error);
    res.status(500).json({ error: 'Falha ao criar preferência' });
  }
});

app.post('/api/payments/webhook', async (req, res) => {
  console.log('Webhook recebido:', req.body);

  try {
    const paymentId = req.query.id || req.body?.data?.id;

    if (!paymentId) {
      console.log('Webhook ignorado: sem paymentId');
      return res.sendStatus(200);
    }

    const payment = new Payment(client);
    const paymentInfo = await payment.get({ id: paymentId });

    const status = paymentInfo.status;
    const orderId = paymentInfo.external_reference;

    console.log('Pedido:', orderId, 'Status MP:', status);

    if (orderId) {
      let orderStatus = 'Aguardando pagamento';

      if (status === 'approved')                          orderStatus = 'Pago';
      else if (status === 'pending' || status === 'in_process') orderStatus = 'Pendente';
      else if (status === 'rejected')                     orderStatus = 'Recusado';
      else if (status === 'cancelled')                    orderStatus = 'Cancelado';

      const orderRef = doc(db, 'pedidos', orderId);
      await updateDoc(orderRef, {
        status: orderStatus,
        mercadoPagoStatus: status,
        mercadoPagoPaymentId: String(paymentId),
        atualizadoEm: new Date().toISOString(),
      });

      console.log(`Pedido ${orderId} atualizado para: ${orderStatus}`);
    }

    return res.sendStatus(200);
  } catch (error) {
    console.error('Erro no webhook:', error);
    return res.sendStatus(200);
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend rodando na porta ${PORT}`);
});
