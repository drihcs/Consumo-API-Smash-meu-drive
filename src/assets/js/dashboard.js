// Função auxiliar para obter elementos com segurança
function getElement(id) {
  const element = document.getElementById(id)
  if (!element) {
    console.warn(`Elemento com ID '${id}' não encontrado`)
  }
  return element
}

// Função para formatar o tamanho do arquivo
function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

// Função para enviar arquivos - corrigida para evitar erros de elementos nulos
window.sendFiles = () => {
  console.log("Função sendFiles iniciada")

  // Obter elementos com segurança
  const fileInput = getElement("fileInput")
  const progressContainer = getElement("progressContainer")
  const progressBar = getElement("progressBar")
  const progressText = getElement("progressText")
  const uploadStatus = getElement("uploadStatus")
  const statusText = getElement("statusText")
  const sendButton = getElement("sendButton")

  // Verificar se os elementos necessários existem
  if (!fileInput) {
    console.error("Input de arquivo não encontrado")
    alert("Erro: Input de arquivo não encontrado")
    return
  }

  // Verificar se há arquivos selecionados
  if (!fileInput.files || fileInput.files.length === 0) {
    alert("Por favor, selecione pelo menos um arquivo")
    return
  }

  // Mostrar progresso apenas se os elementos existirem
  if (progressContainer) {
    progressContainer.style.display = "block"
  }

  if (uploadStatus) {
    uploadStatus.style.display = "block"
  }

  if (statusText) {
    statusText.textContent = "Enviando..."
  }

  if (sendButton) {
    sendButton.disabled = true
  }

  // Simular progresso de upload
  let progress = 0
  const interval = setInterval(() => {
    progress += 5

    // Atualizar barra de progresso se existir
    if (progressBar && progressBar.style) {
      progressBar.style.width = `${progress}%`
    }

    // Atualizar texto de progresso se existir
    if (progressText) {
      progressText.textContent = `${progress}%`
    }

    // Quando o progresso chegar a 100%
    if (progress >= 100) {
      clearInterval(interval)

      if (statusText) {
        statusText.textContent = "Upload concluído!"
      }

      if (progressBar && progressBar.style) {
        progressBar.style.backgroundColor = "var(--color-success)"
      }

      // Adicionar arquivos à tabela
      addFilesToTable(Array.from(fileInput.files))

      // Habilitar o botão novamente após 2 segundos
      setTimeout(() => {
        if (sendButton) {
          sendButton.disabled = false
        }
      }, 2000)
    }
  }, 200)
}

// Função para adicionar arquivos à tabela
function addFilesToTable(files) {
  const fileTableBody = getElement("fileTableBody")
  if (!fileTableBody) {
    console.warn("Tabela de arquivos não encontrada")
    return
  }

  // Remover mensagem de vazio se existir
  const emptyMessage = document.querySelector(".empty-message")
  if (emptyMessage) {
    emptyMessage.style.display = "none"
  }

  // Adicionar cada arquivo à tabela
  files.forEach((file) => {
    const row = document.createElement("tr")
    row.className = "fade-in"

    // Determinar o ícone com base no tipo de arquivo
    let fileIcon = '<i class="ph ph-file"></i>'
    const fileExt = file.name.split(".").pop().toLowerCase()

    if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(fileExt)) {
      fileIcon = '<i class="ph ph-file-image"></i>'
    } else if (["doc", "docx", "odt"].includes(fileExt)) {
      fileIcon = '<i class="ph ph-file-doc"></i>'
    } else if (["pdf"].includes(fileExt)) {
      fileIcon = '<i class="ph ph-file-pdf"></i>'
    } else if (["zip", "rar", "7z", "tar", "gz"].includes(fileExt)) {
      fileIcon = '<i class="ph ph-file-archive"></i>'
    } else if (["txt", "md"].includes(fileExt)) {
      fileIcon = '<i class="ph ph-file-text"></i>'
    }

    row.innerHTML = `
      <td>${fileIcon} <span>${file.name}</span></td>
      <td>${formatFileSize(file.size)}</td>
      <td><i class="ph ph-check-circle" style="color: var(--color-success);"></i> Enviado</td>
    `

    fileTableBody.appendChild(row)
  })

  // Adicionar ao acesso rápido
  if (files.length > 0) {
    addToQuickAccess(files[0])
  }
}

// Função para adicionar ao acesso rápido
function addToQuickAccess(file) {
  const quickAccessList = getElement("quickAccessList")
  if (!quickAccessList) return

  const fileExt = file.name.split(".").pop().toLowerCase()
  let fileIcon = "ph-fill ph-file"

  if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(fileExt)) {
    fileIcon = "ph-fill ph-file-image"
  } else if (["doc", "docx", "odt"].includes(fileExt)) {
    fileIcon = "ph-fill ph-file-doc"
  } else if (["pdf"].includes(fileExt)) {
    fileIcon = "ph-fill ph-file-pdf"
  } else if (["zip", "rar", "7z", "tar", "gz"].includes(fileExt)) {
    fileIcon = "ph-fill ph-file-archive"
  } else if (["txt", "md"].includes(fileExt)) {
    fileIcon = "ph-fill ph-file-text"
  }

  // Criar novo item
  const newItem = document.createElement("li")
  newItem.innerHTML = `
    <i class="${fileIcon}"></i>
    <span>${file.name}</span>
  `

  // Adicionar ao início da lista
  if (quickAccessList.firstChild) {
    quickAccessList.insertBefore(newItem, quickAccessList.firstChild)
  } else {
    quickAccessList.appendChild(newItem)
  }
}

// Função para buscar arquivos
window.searchFiles = () => {
  const searchInput = getElement("searchInput")
  const fileTableBody = getElement("fileTableBody")

  if (!searchInput || !fileTableBody) return

  const searchTerm = searchInput.value.toLowerCase()
  const rows = fileTableBody.getElementsByTagName("tr")

  for (let i = 0; i < rows.length; i++) {
    const fileName = rows[i].querySelector("td:first-child").textContent.toLowerCase()
    if (fileName.includes(searchTerm)) {
      rows[i].style.display = ""
    } else {
      rows[i].style.display = "none"
    }
  }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM carregado, inicializando...")

  // Configurar o input de arquivo
  const fileInput = getElement("fileInput")
  const dropzone = getElement("dropzone")

  if (fileInput && dropzone) {
    // Clicar na área de upload
    dropzone.addEventListener("click", () => {
      fileInput.click()
    })

    // Atualizar quando arquivos são selecionados
    fileInput.addEventListener("change", function () {
      const sendButton = getElement("sendButton")
      if (sendButton) {
        sendButton.disabled = this.files.length === 0
      }
    })

    // Configurar drag and drop
    ;["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
      dropzone.addEventListener(
        eventName,
        (e) => {
          e.preventDefault()
          e.stopPropagation()
        },
        false,
      )
    })
    ;["dragenter", "dragover"].forEach((eventName) => {
      dropzone.addEventListener(
        eventName,
        function () {
          this.classList.add("drag-over")
        },
        false,
      )
    })
    ;["dragleave", "drop"].forEach((eventName) => {
      dropzone.addEventListener(
        eventName,
        function () {
          this.classList.remove("drag-over")
        },
        false,
      )
    })

    dropzone.addEventListener(
      "drop",
      (e) => {
        const dt = e.dataTransfer
        const files = dt.files
        fileInput.files = files

        const sendButton = getElement("sendButton")
        if (sendButton) {
          sendButton.disabled = files.length === 0
        }
      },
      false,
    )
  }
})