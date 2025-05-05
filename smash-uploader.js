// Simulação do SmashUploader para desenvolvimento
class SmashUploader {
  constructor(options) {
    this.region = options.region || "eu-west-3"
    this.token = options.token || "token-simulado"
    this.eventHandlers = {}
    console.log("SmashUploader inicializado com região:", this.region)
  }

  on(eventName, callback) {
    if (!this.eventHandlers[eventName]) {
      this.eventHandlers[eventName] = []
    }
    this.eventHandlers[eventName].push(callback)
    return this
  }

  emit(eventName, data) {
    if (this.eventHandlers[eventName]) {
      this.eventHandlers[eventName].forEach((handler) => {
        try {
          handler(data)
        } catch (error) {
          console.error(`Erro ao executar handler para evento ${eventName}:`, error)
        }
      })
    }
    return this
  }

  async upload(options) {
    const files = options.files || []
    const domain = options.domain || "example.com"

    console.log(`Iniciando upload de ${files.length} arquivos para ${domain}`)

    return new Promise((resolve, reject) => {
      if (!files.length) {
        return reject(new Error("Nenhum arquivo para upload"))
      }

      const uploadedFiles = files.map((file, index) => {
        const fileObj = file.file || file
        return {
          name: file.name || fileObj.name,
          size: file.size || fileObj.size,
          path: `/${file.name || fileObj.name}`,
          type: fileObj.type,
        }
      })

      // Simular progresso
      let totalProgress = 0
      const progressInterval = setInterval(() => {
        totalProgress += 5

        if (totalProgress <= 100) {
          // Emitir evento de progresso para cada arquivo
          files.forEach((file, index) => {
            const fileObj = file.file || file
            this.emit("progress", {
              data: {
                progress: { percent: totalProgress },
                file: { name: file.name || fileObj.name },
              },
            })
          })
        }

        if (totalProgress >= 100) {
          clearInterval(progressInterval)

          // Simular um pequeno atraso antes de completar
          setTimeout(() => {
            resolve({
              files: uploadedFiles,
              domain: domain,
            })
          }, 500)
        }
      }, 200)
    })
  }
}

// Exportar para uso como módulo ou globalmente
export { SmashUploader }
