import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://emyhfscwudyiqnxplfal.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVteWhmc2N3dWR5aXFueHBsZmFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ1NTkxMzAsImV4cCI6MjEwMDEzNTEzMH0.CjhcY_itqypQylQt5K7nZTRrUfJI-SdzpCBuEQ7Yuf8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createAdmin() {
  console.log('Criando usuário admin no Supabase Auth...');
  
  const { data, error } = await supabase.auth.signUp({
    email: 'torcidaprime01@gmail.com',
    password: '19122002Laah.',
  });

  if (error) {
    console.error('❌ Erro:', error.message);
  } else {
    console.log('✅ Usuário criado com sucesso!');
    console.log('ID:', data.user?.id);
    console.log('Email:', data.user?.email);
    console.log('Confirmado:', data.user?.email_confirmed_at ? 'Sim' : 'Necessita confirmação por email');
  }
}

createAdmin();
