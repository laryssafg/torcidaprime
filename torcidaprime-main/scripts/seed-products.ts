import { createClient } from '@supabase/supabase-js';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { PRODUCTS } from '../src/constants';
import 'dotenv/config';

async function seed() {
  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY in environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('🚀 Iniciando importação de produtos para o Supabase...');
    console.log(`📊 Total de produtos no arquivo local: ${PRODUCTS.length}`);

    // Pegar todos os produtos existentes para evitar duplicatas
    const { data: existingProducts, error: fetchError } = await supabase
      .from('produtos')
      .select('nome, name');

    if (fetchError) throw fetchError;

    const existingNames = new Set(
      (existingProducts || []).map((d: any) => (d.nome || d.name || '').toString().toLowerCase())
    );

    let importedCount = 0;
    let skippedCount = 0;
    const toInsert: any[] = [];

    for (const product of PRODUCTS) {
      const normalizedName = (product.name || '').toLowerCase();

      if (existingNames.has(normalizedName)) {
        skippedCount++;
        continue;
      }

      toInsert.push({
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
        // Legado / Compatibilidade
        name: product.name,
        price: Number(product.price),
        category: product.category,
        images: Array.isArray(product.images) ? product.images : [],
        sizes: Array.isArray(product.sizes) ? product.sizes : [],
      });
      importedCount++;
    }

    // Inserir em lotes de 400
    const BATCH_SIZE = 400;
    for (let i = 0; i < toInsert.length; i += BATCH_SIZE) {
      const batch = toInsert.slice(i, i + BATCH_SIZE);
      console.log(`⏳ Gravando lote de ${batch.length} produtos...`);
      const { error: insertError } = await supabase.from('produtos').insert(batch);
      if (insertError) throw insertError;
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
