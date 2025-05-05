document.addEventListener("DOMContentLoaded", () => {
  // Configurar o nome do usuário
  const userName = document.getElementById("userName")
  userName.textContent = "Usuário"

  // Configurar o progresso do armazenamento
  const progressCircle = document.querySelector(".progress-circle .progress")
  const progressText = document.querySelector(".progress-text")

  // Calcular a porcentagem de armazenamento usado (1.05GB de 5GB = 21%)
  const storageUsed = 1.05
  const storageTotal = 5
  const storagePercentage = (storageUsed / storageTotal) * 100

  // Atualizar o círculo de progresso
  const circumference = 2 * Math.PI * 50 // 2πr, onde r = 50
  progressCircle.style.strokeDasharray = circumference
  progressCircle.style.strokeDashoffset = circumference - (circumference * storagePercentage) / 100

  // Atualizar o texto de progresso
  progressText.textContent = `${Math.round(storagePercentage)}%`

  // Configurar o drag and drop para a área de upload
  const dropzone = document.getElementById("dropzone")
  const fileInput = document.getElementById("fileInput")
  const sendButton = document.getElementById("sendButton")

  // Desabilitar o botão de envio inicialmente
  sendButton.disabled = true

  // Eventos de drag and drop
  ;["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    dropzone.addEventListener(eventName, preventDefaults, false)
  })

  function preventDefaults(e) {
    e.preventDefault()
    e.stopPropagation()
  }
  ;["dragenter", "dragover"].forEach((eventName) => {
    dropzone.addEventListener(eventName, highlight, false)
  })
  ;["dragleave", "drop"].forEach((eventName) => {
    dropzone.addEventListener(eventName, unhighlight, false)
  })

  function highlight() {
    dropzone.classList.add("drag-over")
  }

  function unhighlight() {
    dropzone.classList.remove("drag-over")
  }

  dropzone.addEventListener("drop", handleDrop, false)

  function handleDrop(e) {
    const dt = e.dataTransfer
    const files = dt.files
    fileInput.files = files
    updateFileList(files)
  }

  // Atualizar quando arquivos são selecionados via input
  fileInput.addEventListener("change", function () {
    updateFileList(this.files)
  })

  function updateFileList(files) {
    if (files.length > 0) {
      sendButton.disabled = false
    } else {
      sendButton.disabled = true
    }
  }

  // Função para buscar arquivos
  window.searchFiles = () => {
    const searchInput = document.getElementById("searchInput")
    const searchTerm = searchInput.value.toLowerCase()
    const fileRows = document.querySelectorAll("#fileTableBody tr")

    fileRows.forEach((row) => {
      const fileName = row.querySelector("td:first-child").textContent.toLowerCase()
      if (fileName.includes(searchTerm)) {
        row.style.display = ""
      } else {
        row.style.display = "none"
      }
    })
  }
})

// Função para formatar o tamanho do arquivo
function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}