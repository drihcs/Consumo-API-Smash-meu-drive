const MAX_SIZE_MB = 5; // 5 MB

function showMessage(message, type) {
  const uploadStatus = document.getElementById("uploadStatus");
  const statusText = document.getElementById("statusText");

  statusText.textContent = message;
  uploadStatus.style.display = "block";

  if (type === "error") {
    statusText.className = "error-message";
  } else {
    statusText.className = "success-message";
  }
}

function formatFileSize(bytes) {
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unit = 0;
  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024;
    unit++;
  }
  return `${size.toFixed(2)} ${units[unit]}`;
}

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

  su.upload({ files: files })
    .then((transfer) => {
      const uploadedFile = transfer.files[0];
      const downloadLink = uploadedFile.url;

      showMessage("Arquivo enviado com sucesso!", "success");
      progressStatus.textContent = "Concluído";

      // Adiciona à tabela de arquivos
