export default () => ({
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
})
