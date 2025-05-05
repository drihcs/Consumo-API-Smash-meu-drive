// Seleciona o botão de alternância de tema
const themeToggleButton = document.getElementById('themeToggle');

// Verifica se o tema preferido do usuário está armazenado no localStorage
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  document.body.classList.add(savedTheme);
} else {
  // Se não houver tema preferido, define o escuro como tema principal (padrão)
  document.body.classList.add('dark');
}

// Função para alternar entre os temas
themeToggleButton.addEventListener('click', () => {
  // Alterna entre o tema escuro e o tema claro
  if (document.body.classList.contains('dark')) {
    document.body.classList.remove('dark');
    document.body.classList.add('light');
    localStorage.setItem('theme', 'light');  // Armazena o tema claro
  } else {
    document.body.classList.remove('light');
    document.body.classList.add('dark');
    localStorage.setItem('theme', 'dark');  // Armazena o tema escuro
  }
});

