const supabase = supabase.createClient(
    'https://vqtpugingdnfmvhyjtpl.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxdHB1Z2luZ2RuZm12aHlqdHBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzOTYzMjcsImV4cCI6MjA2MTk3MjMyN30.m559pKa2z3d1ca6YhmrrdinTtC60xJBtXQb1z2nWzwo'
  );
  
  async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
  
    if (error) {
      alert('Erro: ' + error.message);
    } else {
      alert('Login bem-sucedido!');
      // exemplo: redirecionar para dashboard
      // window.location.href = 'dashboard.html';
    }
  }
  
  document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const senha = document.getElementById('password').value;
    login(email, senha);
  });