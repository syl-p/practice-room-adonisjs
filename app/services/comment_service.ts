export default class CommentService {
  static convertUrlToLink(content: string) {
    const urlRegex = /(https?:\/\/[^\s]+)/g
    return content.replace(
      urlRegex,
      (url) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
    )
  }
}
