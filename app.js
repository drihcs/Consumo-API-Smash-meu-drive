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
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjI1MWJmNTRkLTc3ZjktNGU4OC1hYzNmLTcwZjNkYmQ1YTdmNi1ldSIsInVzZXJuYW1lIjoiYTk4MTIzYmEtOTdjYS00OTE2LWIwN2QtYjM1MWEwYWFmZmY1IiwicmVnaW9uIjoidXMtZWFzdC0xIiwiaXAiOiIxNzcuMzcuMTM2Ljk1Iiwic2NvcGUiOiJOb25lIiwiYWNjb3VudCI6ImM4Zjk0ZjNiLTI4NWYtNGQ2Yy1iYTA5LTdlYTkwMTQzNDgxYS1lYSIsImlhdCI6MTc0NjQzNTIyMCwiZXhwIjo0OTAyMTk1MjIwfQ.hILwfE6Xz90J5VBWOP33I3edqSS5DqXJyLRgH6wVDT8",
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

  su.upload({ files })
    .then((result) => {
      const transferUrl = result?.transfer?.transferUrl;

      if (transferUrl) {
        // Sucesso no upload
        progressBar.style.width = "100%";
        progressText.textContent = "Upload concluído!";

        // Exibe a URL de download do arquivo
        console.log("Link do arquivo enviado:", transferUrl);

        // Adiciona o arquivo à tabela
        const uploadedFile = result?.transfer?.files[0];
        if (uploadedFile) {
          const row = document.createElement("tr");
          const nameCell = document.createElement("td");
          const link = document.createElement("a");
          link.href = transferUrl;
          link.textContent = uploadedFile.name || "Arquivo";
          link.target = "_blank";
          nameCell.appendChild(link);

          const sizeCell = document.createElement("td");
          sizeCell.textContent = formatFileSize(uploadedFile.size);

          const statusCell = document.createElement("td");
          statusCell.textContent = "Enviado";

          row.appendChild(nameCell);
          row.appendChild(sizeCell);
          row.appendChild(statusCell);

          fileTableBody.appendChild(row);
        }
      } else {
        console.error("Erro: transferUrl não encontrado.");
      }

      // Esconde a barra de progresso após 3 segundos
      setTimeout(() => {
        progressContainer.style.display = "none";
      }, 3000);
    })
    .catch((error) => {
      console.error("Erro durante o upload:", error);
      progressBar.style.width = "100%";
      progressBar.style.backgroundColor = "var(--error-text)";
      progressText.textContent = "Erro ao enviar arquivos";

      setTimeout(() => {
        progressContainer.style.display = "none";
      }, 3000);
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