export default () => ({
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
})
