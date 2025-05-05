class SmashUploader {
    constructor(options) {
      this.region = options.region
      this.token = options.token
    }
  
    async upload(options) {
      const { files, domain, onProgress } = options
  
      // Simulate upload process
      return new Promise((resolve) => {
        const uploadedFiles = files.map((file) => ({
          name: file.name,
          size: file.file.size,
          path: `/${file.name}`, // Simulate path
        }))
  
        let completed = 0
        files.forEach((file, index) => {
          const interval = setInterval(() => {
            const progress = Math.min(100, (completed / files.length) * 100 + 25)
            onProgress({ file: file, percent: progress })
            completed++
  
            if (progress >= 100) {
              clearInterval(interval)
              if (index === files.length - 1) {
                setTimeout(() => {
                  resolve({ files: uploadedFiles, domain: domain })
                }, 500)
              }
            }
          }, 200)
        })
      })
    }
  }
  
  export default SmashUploader
  