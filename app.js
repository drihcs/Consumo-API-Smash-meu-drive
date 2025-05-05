async function upload() {
  const fileInput = document.getElementById("uploadInput");
  const tabela = document.getElementById("tabelaArquivos");
  const corpoTabela = document.getElementById("corpoTabelaArquivos");
  const mensagemCarregando = document.getElementById("mensagemCarregando");
  const mensagemErro = document.getElementById("mensagemErro");

  // Limpa estados anteriores
  mensagemCarregando.classList.remove("hidden");
  mensagemErro.classList.add("hidden");
  mensagemErro.textContent = "";
  corpoTabela.innerHTML = "";

  // Verifica se há arquivos selecionados
  if (fileInput.files.length === 0) {
    mensagemCarregando.classList.add("hidden");
    mensagemErro.classList.remove("hidden");
    mensagemErro.textContent = "Selecione pelo menos um arquivo.";
    return;
  }

  // Inicializa o uploader
  const su = new SmashUploader({
    region: "us-east-1",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." // Substitua por seu token real
  });

  // Prepara os arquivos para envio
  const parsedFiles = [...fileInput.files].map(file => ({
    name: file.webkitRelativePath || file.name,
    file
  }));

  try {
    const transfer = await su.upload({
      files: parsedFiles,
      domain: "mh-nuvem0729.fromsmash.com"
    });

    mensagemCarregando.classList.add("hidden");
    tabela.classList.remove("hidden");

    // Exibe arquivos na tabela
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

  // Progresso do upload (opcional)
  su.on('progress', (event) => {
    const percent = event.data.progress.percent;
    console.log(`Progresso: ${percent}%`);
    // Aqui você pode atualizar uma barra de progresso visual, se quiser
  });
}
