document.addEventListener("DOMContentLoaded", () => {
  let nomeUsuario = ""; // Ou valor vindo de login
  nomeUsuario = nomeUsuario || "Visitante";

  const nomeUsuarioElement = document.getElementById("userName");
  if (nomeUsuarioElement) {
    nomeUsuarioElement.textContent = `Olá, ${nomeUsuario}`;
  }

  // Exibir o progresso do armazenamento
  function setProgress(percent) {
    const circle = document.querySelector('.progress');
    const text = document.getElementById('progress-text');

    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;

    if (circle && text) {
      circle.style.strokeDashoffset = offset;
      text.textContent = `${percent.toFixed(0)}%`;
    }
  }

  // Exemplo de dados
  const usado = 3.2; // em GB
  const total = 15;  // em GB
  const percentual = (usado / total) * 100;

  setProgress(percentual);
});
