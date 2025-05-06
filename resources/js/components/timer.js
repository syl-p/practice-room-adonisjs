export default () => ({
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
})
