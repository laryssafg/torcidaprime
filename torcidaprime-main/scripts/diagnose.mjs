import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://emyhfscwudyiqnxplfal.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVteWhmc2N3dWR5aXFueHBsZmFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ1NTkxMzAsImV4cCI6MjEwMDEzNTEzMH0.CjhcY_itqypQylQt5K7nZTRrUfJI-SdzpCBuEQ7Yuf8';
const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnose() {
  console.log('=== DIAGNÓSTICO SUPABASE ===\n');

  // 1. Ver produtos no banco
  const { data: produtos, error: prodErr } = await supabase.from('produtos').select('id, name, images, imagens').limit(5);
  if (prodErr) {
    console.error('Erro ao buscar produtos:', prodErr.message);
  } else {
    console.log('Produtos encontrados:', produtos?.length);
    produtos?.forEach(p => {
      console.log(`  - "${p.name}" | images: ${JSON.stringify(p.images)} | imagens: ${JSON.stringify(p.imagens)}`);
    });
  }

  console.log('\n--- Testando Storage ---');
  // 2. Verificar se o bucket existe
  const { data: buckets, error: buckErr } = await supabase.storage.listBuckets();
  if (buckErr) {
    console.error('Erro ao listar buckets:', buckErr.message);
  } else {
    console.log('Buckets disponíveis:', buckets?.map(b => `${b.name} (${b.public ? 'público' : 'privado'})`).join(', ') || 'nenhum');
  }

  // 3. Testar upload de arquivo pequeno
  console.log('\n--- Testando upload de arquivo de teste ---');
  const testContent = new Uint8Array([137,80,78,71,13,10,26,10]); // PNG header
  const testBlob = new Blob([testContent], { type: 'image/png' });
  
  const { data: uploadData, error: uploadErr } = await supabase.storage
    .from('produtos')
    .upload(`test_${Date.now()}.png`, testBlob, { upsert: true });

  if (uploadErr) {
    console.error('Falha no upload:', uploadErr.message);
    console.log('→ O bucket "produtos" provavelmente não existe ou não tem permissão de escrita.');
  } else {
    console.log('Upload OK! Path:', uploadData?.path);
    const { data: urlData } = supabase.storage.from('produtos').getPublicUrl(uploadData.path);
    console.log('URL pública:', urlData.publicUrl);
    
    // Limpar arquivo de teste
    await supabase.storage.from('produtos').remove([uploadData.path]);
    console.log('Arquivo de teste removido.');
  }
}

diagnose().catch(console.error);
