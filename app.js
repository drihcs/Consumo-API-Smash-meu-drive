async function upload() {
    const fileInput = document.getElementById("fileInput");
    const fileTableBody = document.getElementById("fileTableBody");
    const progressBar = document.getElementById("progressBar");
    const progress = document.getElementById("progress");
    const uploadStatus = document.getElementById("uploadStatus");
    const statusText = document.getElementById("statusText");
  
    if (!fileInput.files.length) {
      alert("Selecione pelo menos um arquivo.");
      return;
    }
  
    progressBar.style.display = "block";
    uploadStatus.style.display = "block";
    statusText.textContent = "Enviando...";
  
    const su = new SmashUploader({
      region: "us-east-1",
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYzZjY2NTM5LWJmYzMtNDYxYy05ZWRhLTI3YjY5N2U3ODY4Yi1ldSIsInVzZXJuYW1lIjoiMGMyODBlYjItYTM2My00NWUxLWFhZmQtZmQwZjBjZTY4NDNiIiwicmVnaW9uIjoidXMtZWFzdC0xIiwiaXAiOiIxNzcuMzcuMTM2Ljk1Iiwic2NvcGUiOiJOb25lIiwiYWNjb3VudCI6ImM4Zjk0ZjNiLTI4NWYtNGQ2Yy1iYTA5LTdlYTkwMTQzNDgxYS1lYSIsImlhdCI6MTc0NjQxMDg4MiwiZXhwIjo0OTAyMTcwODgyfQ.bAjLzkJnlzP3JFIxHNbAaNulxp1CmBK15Aaa3I8gBNs"
    });
  
    const parsedFiles = [...fileInput.files].map(file => ({
      name: file.name,
      file: file
    }));
  
    try {
      const transfer = await su.upload({
        files: parsedFiles,
        domain: "mh-nuvem0729.fromsmash.com",
        onProgress: (progressData) => {
          const percent = progressData.percent.toFixed(2);
          progress.style.width = `${percent}%`;
          progress.textContent = `${percent}%`;
          statusText.textContent = `Enviando ${progressData.file.name}...`;
        }
      });
  
      statusText.textContent = "Upload concluído!";
      progress.style.backgroundColor = "blue";
  
      transfer.files.forEach(file => {
        const fileUrl = `https://${transfer.domain}/${file.path}`;
        const row = document.createElement("tr");
        row.innerHTML = `
          <td><a href="${fileUrl}" target="_blank">${file.name}</a></td>
          <td>${(file.size / 1024).toFixed(2)} KB</td>
          <td>✔️ Enviado</td>
        `;
        fileTableBody.appendChild(row);
      });
  
    } catch (error) {
      console.error("Erro no upload:", error);
      statusText.textContent = "Erro ao enviar os arquivos.";
      progress.style.backgroundColor = "red";
    }
  }  