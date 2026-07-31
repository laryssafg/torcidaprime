import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://emyhfscwudyiqnxplfal.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVteWhmc2N3dWR5aXFueHBsZmFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ1NTkxMzAsImV4cCI6MjEwMDEzNTEzMH0.CjhcY_itqypQylQt5K7nZTRrUfJI-SdzpCBuEQ7Yuf8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testLogin() {
  console.log('Testando login...');
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'torcidaprime01@gmail.com',
    password: '19122002Laah.',
  });

  if (error) {
    console.error('❌ Erro no login:', error.message);
    console.error('Código:', error.status);
  } else {
    console.log('✅ Login OK!');
    console.log('User ID:', data.user?.id);
    console.log('Email confirmado:', data.user?.email_confirmed_at);
  }
}

testLogin();
