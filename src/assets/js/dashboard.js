document.addEventListener("DOMContentLoaded", () => {
  // Obter o nome do usuário (isso poderia vir de um login, cookie, etc.)
  let nomeUsuario = ""; // Ou valor vindo de login
  nomeUsuario = nomeUsuario || "Visitante"; // Se não houver nome, usa "Visitante"

  // Exibir o nome do usuário na tela
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

  // Atualiza o progresso
  setProgress(percentual);
});

// Área de arrastar e soltar
const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("fileInput");

dropzone.addEventListener("dragover", function (e) {
  e.preventDefault(); // Permite soltar
  dropzone.classList.add("dragover");
});

dropzone.addEventListener("dragleave", function () {
  dropzone.classList.remove("dragover");
});

dropzone.addEventListener("drop", function (e) {
  e.preventDefault();
  dropzone.classList.remove("dragover");

  const files = e.dataTransfer.files;
  fileInput.files = files;

  // Chama a função de upload, que você deve definir
  upload(files);
});

// Função de upload (não definida, mas é a que você mencionou que precisa)
function upload(files) {
  const progressBar = document.getElementById("progressBar");
  const progressText = document.getElementById("progressText");

  // Aqui você pode adicionar lógica para enviar os arquivos via uma API
  // Como exemplo simples, vou apenas simular um progresso:
  let percent = 0;
  const interval = setInterval(() => {
    if (percent < 100) {
      percent += 10; // Aumenta o progresso em 10% a cada 1 segundo
      setProgress(percent);
      progressBar.style.width = `${percent}%`;
      progressText.textContent = `${percent}%`;
    } else {
      clearInterval(interval);
      alert("Upload concluído!");
    }
  }, 1000);
}
