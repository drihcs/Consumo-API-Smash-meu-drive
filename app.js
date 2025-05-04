<!DOCTYPE html>
<html lang="en-US">

<head>
  <meta charset="UTF-8" />
  <script src="https://unpkg.com/@smash-sdk/uploader/dist/SmashUploader.browser.js"></script>
  <style>
    table {
      margin-top: 20px;
      border-collapse: collapse;
      width: 100%;
    }

    th, td {
      border: 1px solid #ddd;
      padding: 8px;
    }

    th {
      background-color: #f2f2f2;
      text-align: left;
    }

    .hidden {
      display: none;
    }
  </style>
</head>

<body>
  <form name="uploadForm">
    <label for="folderUpload">Select a folder to upload:</label><br>
    <input type="file" id="uploadInput" webkitdirectory directory multiple>
    <input type="button" onclick="upload();" value="Send file(s)">
  </form>

  <div id="mensagemCarregando" class="hidden">Uploading, please wait...</div>
  <div id="mensagemErro" class="hidden" style="color: red;"></div>

  <table id="tabelaArquivos" class="hidden">
    <thead>
      <tr>
        <th>Nome do Arquivo</th>
        <th>Tamanho</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody id="corpoTabelaArquivos"></tbody>
  </table>

  <script>
    async function upload() {
      const fileInput = document.getElementById("uploadInput");
      const tabela = document.getElementById("tabelaArquivos");
      const corpoTabela = document.getElementById("corpoTabelaArquivos");
      const mensagemCarregando = document.getElementById("mensagemCarregando");
      const mensagemErro = document.getElementById("mensagemErro");

      mensagemCarregando.classList.remove("hidden");
      mensagemErro.classList.add("hidden");
      corpoTabela.innerHTML = "";

      const su = new SmashUploader({
        region: "us-east-1",
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      });

      const parsedFiles = [...fileInput.files].map(file => ({
        name: file.webkitRelativePath,
        file
      }));

      try {
        const transfer = await su.upload({
          files: parsedFiles,
          domain: "mh-nuvem0729.fromsmash.com"
        });

        mensagemCarregando.classList.add("hidden");
        tabela.classList.remove("hidden");

        transfer.files.forEach(file => {
          const linha = document.createElement("tr");
          const fileUrl = `https://${transfer.domain}/${file.path}`;

          linha.innerHTML = `
            <td><a href="${fileUrl}" target="_blank">${file.name}</a></td>
            <td>${(file.size / 1024).toFixed(2)} KB</td>
            <td>Enviado com sucesso</td>
          `;
          corpoTabela.appendChild(linha);
        });

        console.log("Transferência concluída:", transfer);

      } catch (error) {
        mensagemCarregando.classList.add("hidden");
        mensagemErro.classList.remove("hidden");
        mensagemErro.textContent = "Erro ao enviar arquivos.";
        console.error("Erro no upload:", error);
      }

      su.on('progress', (event) => {
        console.log("Progresso:", event.data.progress.percent + "%");
      });
    }
  </script>
</body>

</html>
