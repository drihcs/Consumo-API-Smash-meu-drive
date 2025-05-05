// ================== CONFIGURAÇÕES GLOBAIS ==================
const MAX_SIZE_MB = 5;

// ================== FUNÇÕES AUXILIARES ==================
function formatFileSize(bytes) {
  const kb = bytes / 1024;
  const mb = kb / 1024;
  return mb > 1 ? `${mb.toFixed(2)} MB` : `${kb.toFixed(2)} KB`;
}

function showMessage(text, type) {
  alert(`${type.toUpperCase()}: ${text}`);
}

function setProgress(percent) {
  const circle = document.querySelector(".progress");
  const text = document.getElementById("progress-text");

  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  if (circle && text) {
    circle.style.strokeDashoffset = offset;
    text.textContent = `${percent.toFixed(0)}%`;
  }
}

// ================== FUNÇÃO PRINCIPAL DE UPLOAD ==================
function upload() {
  const fileInput = document.getElementById("fileInput");
  const files = [...fileInput.files];

  if (files.length === 0) {
    showMessage("Nenhum arquivo selecionado.", "error");
    return;
  }

  const oversized = files.find((file) => file.size > MAX_SIZE_MB * 1024 * 1024);
  if (oversized) {
    showMessage(`O arquivo "${oversized.name}" excede 5MB.`, "error");
    return;
  }

  const su = new SmashUploader({
    region: "us-east-1",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", // token cortado por segurança
    domain: "https://mh-nuvem0729.fromsmash.com/pt",
  });

  const progressBar = document.getElementById("progressBar");
  const progressText = document.getElementById("progressText");
  const progressContainer = document.getElementById("progressContainer");
  const progressStatus = document.getElementById("progressStatus");
  const fileTableBody = document.getElementById("fileTableBody");

  progressContainer.style.display = "block";
  progressBar.style.width = "0%";
  progressText.textContent = "0%";
  progressStatus.textContent = "Enviando...";

  su.on("progress", (data) => {
    const percent = Math.round((data.loaded / data.total) * 100);
    progressBar.style.width = percent + "%";
    progressText.textContent = percent + "%";
  });

  su.upload({ files: files })
    .then((transfer) => {
      const uploadedFile = transfer.files[0];
      const downloadLink = uploadedFile.url;

      showMessage("Arquivo enviado com sucesso!", "success");
      progressStatus.textContent = "Concluído";

      const row = document.createElement("tr");
      const nameCell = document.createElement("td");
      const link = document.createElement("a");
      link.href = downloadLink;
      link.textContent = uploadedFile.name || "Arquivo";
      link.target = "_blank";
      nameCell.appendChild(link);

      const sizeCell = document.createElement("td");
      sizeCell.textContent = formatFileSize(uploadedFile.size || 0);

      const statusCell = document.createElement("td");
      statusCell.textContent = "Enviado";

      row.appendChild(nameCell);
      row.appendChild(sizeCell);
      row.appendChild(statusCell);

      fileTableBody.appendChild(row);
    })
    .catch((error) => {
      console.error("Erro durante o upload:", error);
      showMessage("Erro ao enviar o arquivo. Tente novamente.", "error");
      progressStatus.textContent = "Erro";
    });
}

// ================== EVENTOS DOM ==================
document.addEventListener("DOMContentLoaded", () => {
  const nomeUsuario = "Visitante";
  const nomeUsuarioElement = document.getElementById("userName");
  if (nomeUsuarioElement) nomeUsuarioElement.textContent = `Olá, ${nomeUsuario}`;

  const usado = 3.2;
  const total = 15;
  setProgress((usado / total) * 100);

  const fileInput = document.getElementById("fileInput");
  const fileCount = document.getElementById("fileCount");
  const clearFilesButton = document.getElementById("clearFilesButton");

  fileInput.addEventListener("change", () => {
    const files = fileInput.files;
    if (files.length > 0) {
      fileCount.textContent = `${files.length} arquivo(s) selecionado(s)`;
      clearFilesButton.style.display = "inline-block";
    } else {
      fileCount.textContent = `0 arquivos selecionados`;
      clearFilesButton.style.display = "none";
    }
  });

  clearFilesButton.addEventListener("click", () => {
    fileInput.value = "";
    fileCount.textContent = `0 arquivos selecionados`;
    clearFilesButton.style.display = "none";
  });

  document.getElementById("sendButton").addEventListener("click", () => {
    upload();
  });

  const dropzone = document.getElementById("dropzone");
  dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropzone.classList.add("dragover");
  });

  dropzone.addEventListener("dragleave", () => {
    dropzone.classList.remove("dragover");
  });

  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("dragover");
    const files = e.dataTransfer.files;
    fileInput.files = files;
    upload();
  });
});