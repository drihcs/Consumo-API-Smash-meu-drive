async function upload() {
  const fileInput = document.getElementById("fileInput");
  const progressContainer = document.getElementById("progressContainer");
  const progressBar = document.getElementById("progressBar");
  const progressText = document.getElementById("progressText");
  const progressStatus = document.getElementById("progressStatus");

  // Verificar se arquivos foram selecionados
  if (fileInput.files.length === 0) {
    alert("Por favor, selecione um arquivo para enviar.");
    return; // Se nenhum arquivo foi selecionado, interrompe a execução
  }

  // Exibe a barra de progresso
  progressContainer.style.display = "block";

  const su = new SmashUploader({
    region: "us-east-1",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYzZjY2NTM5LWJmYzMtNDYxYy05ZWRhLTI3YjY5N2U3ODY4Yi1ldSIsInVzZXJuYW1lIjoiMGMyODBlYjItYTM2My00NWUxLWFhZmQtZmQwZjBjZTY4NDNiIiwicmVnaW9uIjoidXMtZWFzdC0xIiwiaXAiOiIxNzcuMzcuMTM2Ljk1Iiwic2NvcGUiOiJOb25lIiwiYWNjb3VudCI6ImM4Zjk0ZjNiLTI4NWYtNGQ2Yy1iYTA5LTdlYTkwMTQzNDgxYS1lYSIsImlhdCI6MTc0NjQxMDg4MiwiZXhwIjo0OTAyMTcwODgyfQ.bAjLzkJnlzP3JFIxHNbAaNulxp1CmBK15Aaa3I8gBNs",
  });

  const files = [...fileInput.files];

  try {
    // Registra o evento de progresso antes de começar o upload
    su.on('progress', (event) => {
      const percent = Math.floor(event.data.progress.percent);
      progressBar.style.width = percent + "%"; // Atualiza a barra de progresso
      progressText.textContent = percent + "%"; // Exibe a porcentagem
    });

    // Inicia o upload
    const transfer = await su.upload({ files: files });

    // Ação após o upload ser concluído
    transfer.on('end', () => {
      progressStatus.textContent = "Upload Concluído!";
      setTimeout(() => {
        progressContainer.style.display = "none"; // Oculta a barra de progresso após a conclusão
      }, 2000); // Espera 2 segundos para ocultar
    });

  } catch (error) {
    console.error("Erro no upload:", error);
    progressStatus.textContent = "Erro ao enviar!";
  }
}
