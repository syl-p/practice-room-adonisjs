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
}))

Alpine.start()
