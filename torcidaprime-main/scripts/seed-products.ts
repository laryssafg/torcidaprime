import { initializeApp } from 'firebase/app';
import { getFirestore, collection, writeBatch, doc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { PRODUCTS } from '../src/constants';

async function seed() {
  try {
    const configPath = join(process.cwd(), 'firebase-applet-config.json');
    const firebaseConfig = JSON.parse(await readFile(configPath, 'utf8'));

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

    console.log('🚀 Iniciando importação de produtos para o Firestore...');
    console.log(`📊 Total de produtos no arquivo local: ${PRODUCTS.length}`);

    // Pegar todos os produtos existentes para evitar chamadas de query individuais (mais rápido)
    const existingSnap = await getDocs(collection(db, 'produtos'));
    const existingNames = new Set(
      existingSnap.docs.map(d => (d.data().nome || d.data().name || '').toString().toLowerCase())
    );

    let importedCount = 0;
    let skippedCount = 0;
    
    // Processar em lotes (Firestore suporta até 500 operações por lote)
    const BATCH_SIZE = 400;
    let currentBatch = writeBatch(db);
    let batchOperationCount = 0;

    for (const product of PRODUCTS) {
      const normalizedName = (product.name || '').toLowerCase();
      
      if (existingNames.has(normalizedName)) {
        skippedCount++;
        continue;
      }

      const productsRef = collection(db, 'produtos');
      const newDocRef = doc(productsRef); // Gera um ID automático

      const productData = {
        nome: product.name,
        preco: Number(product.price),
        categoria: product.category,
        imagens: Array.isArray(product.images) ? product.images : [],
        tamanhos: Array.isArray(product.sizes) ? product.sizes : [],
        personalizacao: Boolean(product.personalizable),
        descricao: product.description || 'Produto oficial selecionado para torcedores apaixonados pela Torcida Prime.',
        ativo: true,
        estoque: 10,
        esgotado: Boolean(product.soldOut),
        criadoEm: serverTimestamp(),
        // Legado / Compatibilidade
        name: product.name,
        price: Number(product.price),
        category: product.category,
        images: Array.isArray(product.images) ? product.images : [],
        sizes: Array.isArray(product.sizes) ? product.sizes : []
      };

      currentBatch.set(newDocRef, productData);
      batchOperationCount++;
      importedCount++;

      // Se atingir o limite do lote, commitamos e iniciamos um novo
      if (batchOperationCount >= BATCH_SIZE) {
        console.log(`⏳ Gravando lote de ${batchOperationCount} produtos...`);
        await currentBatch.commit();
        currentBatch = writeBatch(db);
        batchOperationCount = 0;
      }
    }

    // Commitar qualquer resto no último lote
    if (batchOperationCount > 0) {
      console.log(`⏳ Gravando lote final de ${batchOperationCount} produtos...`);
      await currentBatch.commit();
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✨ RESUMO DA IMPORTAÇÃO');
    console.log(`📦 Importados com sucesso: ${importedCount}`);
    console.log(`⏩ Ignorados (já existem): ${skippedCount}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    process.exit(0);
  } catch (error) {
    console.error('💥 Erro fatal no script de seed:', error);
    process.exit(1);
  }
}

seed();
