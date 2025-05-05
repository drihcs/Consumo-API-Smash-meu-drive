// Importar o SmashUploader
import { SmashUploader } from "https://cdn.jsdelivr.net/npm/@smash-sdk/uploader@latest/dist/index.min.js";

// Variáveis globais
let selectedFiles = [];
let uploader = null;
let currentTransfer = null;

// Função para formatar o tamanho do arquivo
function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// Função para obter elemento com segurança
function getElement(id) {
  const element = document.getElementById(id);
  if (!element) {
    console.warn(`Elemento com ID '${id}' não encontrado no DOM`);
  }
  return element;
}

// Função para atualizar a contagem de arquivos
function updateFileCount() {
  const fileCountElement = getElement("fileCount");
  const clearFilesButton = getElement("clearFilesButton");
  
  if (fileCountElement) {
    fileCountElement.textContent = `${selectedFiles.length} arquivo${selectedFiles.length !== 1 ? 's' : ''} selecionado${selectedFiles.length !== 1 ? 's' : ''}`;
  }
  
  if (clearFilesButton) {
    clearFilesButton.style.display = selectedFiles.length > 0 ? "block" : "none";
  }
  
  // Atualizar o botão de envio
  const sendButton = getElement("sendButton");
  if (sendButton) {
    sendButton.disabled = selectedFiles.length === 0;
  }
}

// Função para limpar a seleção de arquivos
function clearFileSelection() {
  selectedFiles = [];
  updateFileSelection();
  updateFileCount();
  
  const fileInput = getElement("fileInput");
  if (fileInput) {
    fileInput.value = "";
  }
}

// Função para atualizar a exibição dos arquivos selecionados
function updateFileSelection() {
  const selectedFilesElement = getElement("selectedFiles");
  const previewContainer = getElement("previewContainer");
  
  if (!selectedFilesElement || !previewContainer) return;
  
  // Limpar previews anteriores
  previewContainer.innerHTML = "";
  
  if (selectedFiles.length === 0) {
    selectedFilesElement.innerHTML = `
      <p>Nenhum arquivo selecionado</p>
      <p id="fileCount">0 arquivos selecionados</p>
      <button id="clearFilesButton" class="secondary-button" style="display: none;">Limpar seleção</button>
    `;
    return;
  }
  
  // Atualizar a mensagem de arquivos selecionados
  selectedFilesElement.innerHTML = `
    <p>Arquivos selecionados:</p>
    <p id="fileCount">${selectedFiles.length} arquivo${selectedFiles.length !== 1 ? 's' : ''} selecionado${selectedFiles.length !== 1 ? 's' : ''}</p>
    <button id="clearFilesButton" class="secondary-button">Limpar seleção</button>
  `;
  
  // Adicionar evento ao botão de limpar
  const clearButton = getElement("clearFilesButton");
  if (clearButton) {
    clearButton.addEventListener("click", clearFileSelection);
  }
  
  // Criar previews para os arquivos
  selectedFiles.forEach((file, index) => {
    const filePreview = document.createElement("div");
    filePreview.className = "file-preview";
    
    // Determinar o ícone com base no tipo de arquivo
    let fileIcon = '<i class="ph ph-file"></i>';
    const fileExt = file.name.split(".").pop().toLowerCase();
    
    if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(fileExt)) {
      fileIcon = '<i class="ph ph-file-image"></i>';
      
      // Para imagens, criar uma miniatura
      if (file.type.startsWith("image/")) {
        const img = document.createElement("img");
        img.className = "file-thumbnail";
        img.file = file;
        filePreview.appendChild(img);
        
        const reader = new FileReader();
        reader.onload = (function(aImg) { 
          return function(e) { 
            aImg.src = e.target.result; 
          }; 
        })(img);
        reader.readAsDataURL(file);
      }
    } else if (["doc", "docx", "odt"].includes(fileExt)) {
      fileIcon = '<i class="ph ph-file-doc"></i>';
    } else if (["pdf"].includes(fileExt)) {
      fileIcon = '<i class="ph ph-file-pdf"></i>';
    } else if (["zip", "rar", "7z", "tar", "gz"].includes(fileExt)) {
      fileIcon = '<i class="ph ph-file-archive"></i>';
    } else if (["txt", "md"].includes(fileExt)) {
      fileIcon = '<i class="ph ph-file-text"></i>';
    }
    
    const fileInfo = document.createElement("div");
    fileInfo.className = "file-info";
    fileInfo.innerHTML = `
      <div class="file-icon">${fileIcon}</div>
      <div class="file-details">
        <div class="file-name" title="${file.name}">${file.name}</div>
        <div class="file-size">${formatFileSize(file.size)}</div>
      </div>
      <button class="remove-file" data-index="${index}">
        <i class="ph ph-x"></i>
      </button>
    `;
    
    filePreview.appendChild(fileInfo);
    previewContainer.appendChild(filePreview);
    
    // Adicionar evento para remover arquivo
    const removeButton = filePreview.querySelector(".remove-file");
    removeButton.addEventListener("click", function() {
      const index = parseInt(this.getAttribute("data-index"));
      selectedFiles.splice(index, 1);
      updateFileSelection();
      updateFileCount();
    });
  });
}

// Função para inicializar o uploader
function initializeUploader() {
  try {
    uploader = new SmashUploader({
      region: "eu-west-3",
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYzZjY2NTM5LWJmYzMtNDYxYy05ZWRhLTI3YjY5N2U3ODY4Yi1ldSIsInVzZXJuYW1lIjoiMGMyODBlYjItYTM2My00NWUxLWFhZmQtZmQwZjBjZTY4NDNiIiwicmVnaW9uIjoidXMtZWFzdC0xIiwiaXAiOiIxNzcuMzcuMTM2Ljk1Iiwic2NvcGUiOiJOb25lIiwiYWNjb3VudCI6ImM4Zjk0ZjNiLTI4NWYtNGQ2Yy1iYTA5LTdlYTkwMTQzNDgxYS1lYSIsImlhdCI6MTc0NjQxMDg4MiwiZXhwIjo0OTAyMTcwODgyfQ.bAjLzkJnlzP3JFIxHNbAaNulxp1CmBK15Aaa3I8gBNs", // Substitua por sua chave real
    });
    
    console.log("SmashUploader inicializado com sucesso");
    return true;
  } catch (error) {
    console.error("Erro ao inicializar o SmashUploader:", error);
    return false;
  }
}

// Função para enviar arquivos
window.sendFiles = async function() {
  if (selectedFiles.length === 0) {
    alert("Selecione pelo menos um arquivo para enviar.");
    return;
  }
  
  // Verificar se o uploader está inicializado
  if (!uploader && !initializeUploader()) {
    alert("Não foi possível inicializar o uploader. Tente novamente mais tarde.");
    return;
  }
  
  const progressContainer = getElement("progressContainer");
  const progressBar = getElement("progressBar");
  const progressText = getElement("progressText");
  const progressStatus = getElement("progressStatus");
  const uploadStatus = getElement("uploadStatus");
  const statusText = getElement("statusText");
  const sendButton = getElement("sendButton");
  
  if (!progressContainer || !progressBar || !progressText || !progressStatus || !uploadStatus || !statusText) {
    alert("Elementos de progresso não encontrados. Tente recarregar a página.");
    return;
  }
  
  // Desabilitar o botão de envio
  if (sendButton) {
    sendButton.disabled = true;
  }
  
  // Mostrar o container de progresso
  progressContainer.style.display = "block";
  uploadStatus.style.display = "block";
  statusText.textContent = "Preparando para enviar...";
  
  try {
    // Preparar os arquivos para upload
    const parsedFiles = selectedFiles.map(file => ({
      name: file.name,
      file: file
    }));
    
    // Registrar evento de progresso
    uploader.on("progress", (event) => {
      try {
        const percent = Math.round(event.data.progress.percent);
        if (progressBar) progressBar.style.width = `${percent}%`;
        if (progressText) progressText.textContent = `${percent}%`;
        if (progressStatus) progressStatus.textContent = `Enviando ${event.data.file.name}...`;
        console.log(`Progresso: ${percent}%`);
      } catch (error) {
        console.error("Erro ao atualizar progresso:", error);
      }
    });
    
    // Iniciar upload
    currentTransfer = await uploader.upload({
      files: parsedFiles,
      domain: "mh-nuvem0729.fromsmash.com",
    });
    
    if (statusText) statusText.textContent = "Upload concluído com sucesso!";
    if (progressBar) progressBar.style.backgroundColor = "var(--color-success)";
    
    // Adicionar arquivos à tabela
    addFilesToTable(currentTransfer.files);
    
    // Adicionar ao acesso rápido
    if (currentTransfer.files.length > 0) {
      addToQuickAccess(currentTransfer.files[0]);
    }
    
    // Limpar a seleção de arquivos
    clearFileSelection();
    
    // Habilitar o botão após um tempo
    setTimeout(() => {
      if (sendButton) sendButton.disabled = false;
      if (progressContainer) progressContainer.style.display = "none";
    }, 3000);
    
  } catch (error) {
    console.error("Erro no upload:", error);
    if (statusText) statusText.textContent = "Erro ao enviar os arquivos.";
    if (progressBar) progressBar.style.backgroundColor = "var(--color-error)";
    
    // Habilitar o botão após um tempo
    setTimeout(() => {
      if (sendButton) sendButton.disabled = false;
    }, 2000);
  }
};

// Função para adicionar arquivos à tabela
function addFilesToTable(files) {
  const fileTableBody = getElement("fileTableBody");
  const emptyMessage = document.querySelector(".empty-message");
  
  if (!fileTableBody) return;
  
  // Remover a mensagem de vazio se existir
  if (emptyMessage) {
    emptyMessage.style.display = "none";
  }
  
  files.forEach((file) => {
    const fileUrl = `https://${currentTransfer.domain}/${file.path}`;
    const row = document.createElement("tr");
    row.className = "fade-in";
    
    // Determinar o ícone com base no tipo de arquivo
    let fileIcon = '<i class="ph ph-file"></i>';
    const fileExt = file.name.split(".").pop().toLowerCase();
    
    if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(fileExt)) {
      fileIcon = '<i class="ph ph-file-image"></i>';
    } else if (["doc", "docx", "odt"].includes(fileExt)) {
      fileIcon = '<i class="ph ph-file-doc"></i>';
    } else if (["pdf"].includes(fileExt)) {
      fileIcon = '<i class="ph ph-file-pdf"></i>';
    } else if (["zip", "rar", "7z", "tar", "gz"].includes(fileExt)) {
      fileIcon = '<i class="ph ph-file-archive"></i>';
    } else if (["txt", "md"].includes(fileExt)) {
      fileIcon = '<i class="ph ph-file-text"></i>';
    }
    
    row.innerHTML = `
      <td>${fileIcon} <a href="${fileUrl}" target="_blank">${file.name}</a></td>
      <td>${formatFileSize(file.size)}</td>
      <td><i class="ph ph-check-circle" style="color: var(--color-success);"></i> Enviado</td>
    `;
    
    fileTableBody.appendChild(row);
  });
}

// Função para adicionar ao acesso rápido
function addToQuickAccess(file) {
  const quickAccessList = getElement("quickAccessList");
  if (!quickAccessList) return;
  
  const fileExt = file.name.split(".").pop().toLowerCase();
  let fileIcon = "ph-fill ph-file";
  
  if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(fileExt)) {
    fileIcon = "ph-fill ph-file-image";
  } else if (["doc", "docx", "odt"].includes(fileExt)) {
    fileIcon = "ph-fill ph-file-doc";
  } else if (["pdf"].includes(fileExt)) {
    fileIcon = "ph-fill ph-file-pdf";
  } else if (["zip", "rar", "7z", "tar", "gz"].includes(fileExt)) {
    fileIcon = "ph-fill ph-file-archive";
  } else if (["txt", "md"].includes(fileExt)) {
    fileIcon = "ph-fill ph-file-text";
  }
  
  // Criar novo item
  const newItem = document.createElement("li");
  newItem.innerHTML = `
    <i class="${fileIcon}"></i>
    <span>${file.name}</span>
  `;
  
  // Adicionar ao início da lista
  if (quickAccessList.firstChild) {
    quickAccessList.insertBefore(newItem, quickAccessList.firstChild);
  } else {
    quickAccessList.appendChild(newItem);
  }
  
  // Limitar a 5 itens
  while (quickAccessList.children.length > 5) {
    quickAccessList.removeChild(quickAccessList.lastChild);
  }
}

// Função para buscar arquivos
window.searchFiles = function() {
  const searchInput = getElement("searchInput");
  const fileTableBody = getElement("fileTableBody");
  
  if (!searchInput || !fileTableBody) return;
  
  const searchTerm = searchInput.value.toLowerCase();
  const rows = fileTableBody.getElementsByTagName("tr");
  
  for (let i = 0; i < rows.length; i++) {
    const fileName = rows[i].getElementsByTagName("td")[0].textContent.toLowerCase();
    if (fileName.includes(searchTerm)) {
      rows[i].style.display = "";
    } else {
      rows[i].style.display = "none";
    }
  }
};

// Inicializar quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", function() {
  console.log("DOM carregado, inicializando...");
  
  // Inicializar o uploader
  initializeUploader();
  
  // Configurar o input de arquivo
  const fileInput = getElement("fileInput");
  if (fileInput) {
    fileInput.addEventListener("change", function() {
      selectedFiles = Array.from(this.files);
      updateFileSelection();
      updateFileCount();
    });
  }
  
  // Configurar drag and drop
  const dropzone = getElement("dropzone");
  if (dropzone) {
    ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
      dropzone.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    ["dragenter", "dragover"].forEach(eventName => {
      dropzone.addEventListener(eventName, highlight, false);
    });
    
    ["dragleave", "drop"].forEach(eventName => {
      dropzone.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
      dropzone.classList.add("drag-over");
    }
    
    function unhighlight() {
      dropzone.classList.remove("drag-over");
    }
    
    dropzone.addEventListener("drop", handleDrop, false);
    
    function handleDrop(e) {
      const dt = e.dataTransfer;
      const files = dt.files;
      
      selectedFiles = Array.from(files);
      updateFileSelection();
      updateFileCount();
    }
  }
  
  // Configurar o botão de envio
  const sendButton = getElement("sendButton");
  if (sendButton) {
    sendButton.disabled = true;
  }
  
  // Definir o nome do usuário
  const userNameElement = getElement("userName");
  if (userNameElement) {
    userNameElement.textContent = "Usuário GTech";
  }
});
