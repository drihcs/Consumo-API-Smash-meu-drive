import SmashUploader from "./smash-uploader.js"

// Função para formatar o tamanho dos arquivos
function formatFileSize(bytes, si = false, dp = 1) {
  const thresh = si ? 1000 : 1024
  if (Math.abs(bytes) < thresh) return bytes + " B"

  const units = si
    ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"]
  let u = -1
  const r = 10 ** dp

  do {
    bytes /= thresh
    ++u
  } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1)

  return bytes.toFixed(dp) + " " + units[u]
}

// Função para enviar arquivos
async function sendFiles() {
  const fileInput = document.getElementById("fileInput")
  const fileTableBody = document.getElementById("fileTableBody")
  const progressBar = document.getElementById("progressBar")
  const progress = document.getElementById("progress")
  const uploadStatus = document.getElementById("uploadStatus")
  const statusText = document.getElementById("statusText")
  const sendButton = document.getElementById("sendButton")

  if (!fileInput.files.length) {
    alert("Selecione pelo menos um arquivo.")
    return
  }

  // Validação opcional de extensões permitidas
  const allowedExtensions = ["jpg", "jpeg", "png", "gif", "svg", "webp", "pdf", "doc", "docx", "odt", "txt", "md", "zip", "rar", "7z", "tar", "gz"]
  const invalidFiles = [...fileInput.files].filter(file => {
    const ext = file.name.split(".").pop().toLowerCase()
    return !allowedExtensions.includes(ext)
  })

  if (invalidFiles.length) {
    alert("Alguns arquivos possuem formatos não permitidos.")
    return
  }

  progressBar.style.display = "block"
  uploadStatus.style.display = "block"
  statusText.textContent = "Enviando..."
  progress.style.width = "0%"
  progress.style.backgroundColor = "var(--color-primary)"
  sendButton.disabled = true
  sendButton.textContent = "Enviando..."

  const su = new SmashUploader({
    region: "us-east-1",
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYzZjY2NTM5LWJmYzMtNDYxYy05ZWRhLTI3YjY5N2U3ODY4Yi1ldSIsInVzZXJuYW1lIjoiMGMyODBlYjItYTM2My00NWUxLWFhZmQtZmQwZjBjZTY4NDNiIiwicmVnaW9uIjoidXMtZWFzdC0xIiwiaXAiOiIxNzcuMzcuMTM2Ljk1Iiwic2NvcGUiOiJOb25lIiwiYWNjb3VudCI6ImM4Zjk0ZjNiLTI4NWYtNGQ2Yy1iYTA5LTdlYTkwMTQzNDgxYS1lYSIsImlhdCI6MTc0NjQxMDg4MiwiZXhwIjo0OTAyMTcwODgyfQ.bAjLzkJnlzP3JFIxHNbAaNulxp1CmBK15Aaa3I8gBNs",
  })

  const parsedFiles = [...fileInput.files].map((file) => ({
    name: file.name,
    file: file,
  }))

  try {
    const transfer = await su.upload({
      files: parsedFiles,
      domain: "mh-nuvem0729.fromsmash.com",
      onProgress: (progressData) => {
        const percent = progressData.percent.toFixed(2)
        progress.style.width = `${percent}%`
        progress.textContent = `${percent}%`
        statusText.textContent = `Enviando ${progressData.file.name}...`
      },
    })

    statusText.textContent = "Upload concluído!"
    progress.style.backgroundColor = "var(--color-success)"
    sendButton.textContent = "Enviar novamente"

    transfer.files.forEach((file) => {
      const fileUrl = `https://${transfer.domain}/${file.path}`
      const row = document.createElement("tr")
      row.className = "fade-in"

      let fileIcon = '<i class="ph-fill ph-file"></i>'
      const fileExt = file.name.split(".").pop().toLowerCase()

      if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(fileExt)) {
        fileIcon = '<i class="ph-fill ph-file-image"></i>'
      } else if (["doc", "docx", "odt"].includes(fileExt)) {
        fileIcon = '<i class="ph-fill ph-file-doc"></i>'
      } else if (["pdf"].includes(fileExt)) {
        fileIcon = '<i class="ph-fill ph-file-pdf"></i>'
      } else if (["zip", "rar", "7z", "tar", "gz"].includes(fileExt)) {
        fileIcon = '<i class="ph-fill ph-file-archive"></i>'
      } else if (["txt", "md"].includes(fileExt)) {
        fileIcon = '<i class="ph-fill ph-file-text"></i>'
      }

      row.innerHTML = `
        <td>${fileIcon} <a href="${fileUrl}" target="_blank">${file.name}</a></td>
        <td>${formatFileSize(file.size)}</td>
        <td><i class="ph-fill ph-check-circle" style="color: var(--color-success);"></i> Enviado</td>
      `

      fileTableBody.appendChild(row)
    })

    // Acesso rápido - limpar antes
    const quickAccessList = document.getElementById("quickAccessList")
    quickAccessList.innerHTML = ""

    transfer.files.forEach((file) => {
      const fileExt = file.name.split(".").pop().toLowerCase()
      let fileIcon = '<i class="ph-fill ph-file"></i>'

      if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(fileExt)) {
        fileIcon = '<i class="ph-fill ph-file-image"></i>'
      } else if (["doc", "docx", "odt"].includes(fileExt)) {
        fileIcon = '<i class="ph-fill ph-file-doc"></i>'
      } else if (["pdf"].includes(fileExt)) {
        fileIcon = '<i class="ph-fill ph-file-pdf"></i>'
      } else if (["zip", "rar", "7z", "tar", "gz"].includes(fileExt)) {
        fileIcon = '<i class="ph-fill ph-file-archive"></i>'
      } else if (["txt", "md"].includes(fileExt)) {
        fileIcon = '<i class="ph-fill ph-file-text"></i>'
      }

      const newItem = document.createElement("li")
      newItem.innerHTML = fileIcon
      quickAccessList.insertBefore(newItem, quickAccessList.firstChild)

      const newTitle = document.createElement("h5")
      newTitle.textContent = file.name
      quickAccessList.insertBefore(newTitle, quickAccessList.childNodes[1])
    })

    fileInput.value = ""
    setTimeout(() => {
      sendButton.disabled = false
    }, 2000)
  } catch (error) {
    console.error("Erro no upload:", error)
    statusText.textContent = "Erro ao enviar os arquivos."
    progress.style.backgroundColor = "var(--color-error)"
    sendButton.textContent = "Tentar novamente"

    setTimeout(() => {
      sendButton.disabled = false
    }, 2000)
  }
}

// Drag and Drop
document.addEventListener("DOMContentLoaded", () => {
  const dropzone = document.getElementById("dropzone")
  const fileInput = document.getElementById("fileInput")

  ;["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    dropzone.addEventListener(eventName, preventDefaults, false)
  })

  function preventDefaults(e) {
    e.preventDefault()
    e.stopPropagation()
  }

  ;["dragenter", "dragover"].forEach((eventName) => {
    dropzone.addEventListener(eventName, () => {
      dropzone.classList.add("drag-over")
    }, false)
  })

  ;["dragleave", "drop"].forEach((eventName) => {
    dropzone.addEventListener(eventName, () => {
      dropzone.classList.remove("drag-over")
    }, false)
  })

  dropzone.addEventListener("drop", (e) => {
    const dt = e.dataTransfer
    const files = dt.files
    fileInput.files = files
  }, false)
})

// Clique no botão
document.getElementById("sendButton").addEventListener("click", sendFiles)
