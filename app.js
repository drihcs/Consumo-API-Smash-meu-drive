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

  progressContainer.style.display = "block"; // Exibe o container de progresso
  progressBar.style.width = "0%"; // Inicia a barra de progresso com 0%
  progressText.textContent = "0%"; // Inicia o texto de progresso com 0%
  progressStatus.textContent = "Enviando..."; // Inicia o status

  su.on("progress", (data) => {
    const percent = Math.round((data.loaded / data.total) * 100);
    progressBar.style.width = percent + "%"; // Atualiza a barra de progresso
    progressText.textContent = percent + "%"; // Atualiza o texto de percentual
  });

  su.upload({ files: files })
    .then((transfer) => {
      const uploadedFile = transfer.files[0];
      const downloadLink = uploadedFile.url;

      showMessage("Arquivo enviado com sucesso!", "success");
      progressStatus.textContent = "Concluído"; // Atualiza o status para concluído

      // Adiciona à tabela de arquivos
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