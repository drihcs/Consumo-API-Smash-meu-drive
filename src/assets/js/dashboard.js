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

// Função para ativar a exibição do botão de envio e a barra de progresso
function handleFileSelection() {
  const fileInput = document.getElementById('fileInput');
  const sendButton = document.getElementById('sendButton');
  const progressBar = document.getElementById('progressBar');
  const uploadStatus = document.getElementById('uploadStatus');
  
  // Exibe a barra de progresso e o botão de envio
  progressBar.style.display = 'block';
  sendButton.style.display = 'inline-block';
  uploadStatus.style.display = 'none'; // Oculta o status de upload até que os arquivos sejam enviados
  
  // Quando arquivos são selecionados, o botão de enviar está visível
  fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
      sendButton.style.display = 'inline-block';
    } else {
      sendButton.style.display = 'none';
    }
  });
}

// Função para enviar os arquivos
function sendFiles() {
  const fileInput = document.getElementById('fileInput');
  const progress = document.getElementById('progress');
  const uploadStatus = document.getElementById('uploadStatus');
  const statusText = document.getElementById('statusText');

  // Exemplo de envio
  const formData = new FormData();
  for (let i = 0; i < fileInput.files.length; i++) {
    formData.append('files[]', fileInput.files[i]);
  }

  // Exemplo de chamada para API (substitua com seu código de envio real)
  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'sua-api-de-upload-aqui', true);
  
  // Atualiza a barra de progresso enquanto o arquivo é carregado
  xhr.upload.onprogress = function(event) {
    if (event.lengthComputable) {
      const percent = (event.loaded / event.total) * 100;
      progress.style.width = percent + '%';
    }
  };

  // Exibe a mensagem de status
  xhr.onload = function() {
    if (xhr.status === 200) {
      statusText.textContent = 'Upload concluído com sucesso!';
    } else {
      statusText.textContent = 'Erro no upload!';
    }
    uploadStatus.style.display = 'block'; // Exibe a mensagem de status
  };

  xhr.send(formData);
}

// Conecta a função de seleção de arquivos
document.getElementById('fileInput').addEventListener('change', handleFileSelection);
