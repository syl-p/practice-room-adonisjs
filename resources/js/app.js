import 'htmx.org'
import Alpine from 'alpinejs'

window.Alpine = Alpine
Alpine.data('fileUpload', () => ({
  file: null,
  imageUrl: null,
  init() {
    this.$watch('file', (newValue) => {
      const reader = new FileReader()
      reader.readAsDataURL(newValue)

      reader.onload = () => {
        this.imageUrl = reader.result
      }
    })
  },
  reset() {
    this.file = null
    this.imageUrl = null
  },
}))

Alpine.data('timer', () => ({
  elapsedTime: 0,
  timer: null,
  started: false,

  start() {
    this.started = true
    this.timer = setInterval(() => {
      this.elapsedTime += 1000
      const value = this.formattedElapsedTime(this.elapsedTime)
      this.$refs.display.innerHTML = value
      this.$refs.input.value = this.elapsedTime / 1000
    }, 1000)
  },
  stop() {
    this.started = false
    clearInterval(this.timer)
    this.timer = undefined
  },
  reset() {
    this.started = false
    this.stop()
    this.elapsedTime = 0
    this.$refs.display.innerHTML = '00:00:00'
  },
  formattedElapsedTime(value) {
    const date = new Date(null)
    date.setSeconds(value / 1000)
    const utc = date.toUTCString()
    return utc.substr(utc.indexOf(':') - 2, 8)
  },
}))

Alpine.data('dragAndDrop', () => ({
  dragging: false,
  files: [],
  handleDrop(event) {
    this.dragging = false
    let droppedFiles = event.dataTransfer?.files
    console.log('droppedFiles', droppedFiles)
    this.handleFiles(droppedFiles)
  },
  handleFiles(fileList) {
    for (let file of fileList) {
      if (
        ['image/png', 'image/jpeg', 'image/webp', 'application/pdf'].includes(file.type) &&
        file.size <= 3 * 1024 * 1024
      ) {
        this.files.push(file)
      }
    }

    // Ajouter les fichiers à l'input file pour HTMX
    const dataTransfer = new DataTransfer()
    this.files.forEach((file) => dataTransfer.items.add(file))
    this.$refs.fileInput.files = dataTransfer.files
  },
}))

Alpine.start()
