console.log("[Boot] Carregando dependências de express, cors, mercadopago...");
import express from 'express';
import cors from 'cors';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import dotenv from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc, serverTimestamp, collection, getDocs, getDoc } from 'firebase/firestore';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

console.log("[Boot] Carregando variáveis de ambiente com dotenv...");
dotenv.config();

console.log("[Boot] Lendo configuração do Firebase...");
const firebaseConfig = JSON.parse(readFileSync(new URL('./firebase-applet-config.json', import.meta.url)));
console.log("[Boot] Inicializando Firebase App e Firestore...");
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

console.log("[Boot] Inicializando Express...");
const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("[Boot] Configurando pasta estática 'dist' para produção...");
app.use(express.static(path.join(__dirname, 'dist')));

console.log("[Boot] Inicializando cliente Mercado Pago...");
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

// ─── BUSCAR PEDIDO PELO CÓDIGO (SUFIXO DO ID) ──────────────────────────────────
app.get('/api/pedidos/buscar/:code', async (req, res) => {
  try {
    const code = req.params.code.trim().toUpperCase().replace('#', '');
    if (!code || code.length < 4) {
      return res.status(400).json({ error: 'Código de pedido muito curto.' });
    }

    console.log(`Buscando pedido com sufixo do ID: ${code}`);

    const querySnapshot = await getDocs(collection(db, 'pedidos'));
    let foundOrder = null;

    querySnapshot.forEach((doc) => {
      const docId = doc.id.toUpperCase();
      if (docId.endsWith(code) || docId === code) {
        foundOrder = { id: doc.id, ...doc.data() };
      }
    });

    if (!foundOrder) {
      return res.status(404).json({ error: 'Pedido não encontrado.' });
    }

    res.json({
      id: foundOrder.id,
      cliente: foundOrder.cliente || foundOrder.customer || {},
      itens: foundOrder.itens || foundOrder.items || [],
      total: foundOrder.total || foundOrder.totalPedido || foundOrder.valorTotal || 0,
      status: foundOrder.status || 'Aguardando pagamento'
    });
  } catch (error) {
    console.error('Erro ao buscar pedido:', error);
    res.status(500).json({ error: 'Erro interno ao buscar o pedido.' });
  }
});

// ─── ADICIONAR PERSONALIZAÇÃO A PEDIDO EXISTENTE ──────────────────────────────
app.post('/api/pedidos/personalizar', async (req, res) => {
  try {
    const { orderId, itemIndex, personalization } = req.body;

    if (!orderId || itemIndex === undefined || !personalization) {
      return res.status(400).json({ error: 'Dados insuficientes.' });
    }

    console.log(`Adicionando personalização ao pedido ${orderId}, item index ${itemIndex}`);

    const docRef = doc(db, 'pedidos', orderId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return res.status(404).json({ error: 'Pedido não encontrado.' });
    }

    const orderData = docSnap.data();
    const itens = orderData.itens || orderData.items || [];

    if (itemIndex < 0 || itemIndex >= itens.length) {
      return res.status(400).json({ error: 'Produto selecionado não faz parte desse pedido.' });
    }

    // Adiciona/atualiza a personalização do item
    itens[itemIndex].personalization = {
      type: personalization.type,
      name: personalization.name || '',
      number: personalization.number || '',
      phrase: personalization.phrase || '',
      observation: personalization.observation || '',
      additionalPrice: Number(personalization.price || 0)
    };

    // Incrementa o valor total do pedido com o valor da personalização
    const currentTotal = Number(orderData.total || orderData.totalPedido || orderData.valorTotal || 0);
    const additionalPrice = Number(personalization.price || 0);
    const newTotal = currentTotal + additionalPrice;

    const updatePayload = {
      total: newTotal,
      atualizadoEm: serverTimestamp()
    };

    if (orderData.itens) {
      updatePayload.itens = itens;
    } else {
      updatePayload.items = itens;
    }

    await updateDoc(docRef, updatePayload);

    res.json({ success: true, newTotal });
  } catch (error) {
    console.error('Erro ao adicionar personalização:', error);
    res.status(500).json({ error: 'Erro interno ao salvar a personalização.' });
  }
});

// Wildcard route to serve the client-side SPA (index.html) for any non-API route
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// ─── START ────────────────────────────────────────────────────────────────────
console.log("[Boot] Inicializando escuta da porta...");
const PORT = process.env.PORT || (process.env.RENDER ? 3000 : 3001);
app.listen(PORT, () => {
  console.log(`[Boot] Servidor iniciado com sucesso! Escutando na porta ${PORT}`);
});
