import User from '#models/user'
import router from '@adonisjs/core/services/router'

export default class MentionService {
  static checkMentions(text: string) {
    const matches = text.matchAll(/@(\w+)/g)
    return new Set(Array.from(matches).map((match) => match[1]))
  }

  static async convertMentionsToLinks(text: string) {
    const matches = this.checkMentions(text)
    for (const match of matches) {
      const user = await User.findBy('username', match)
      if (user) {
        const link = router.builder().params({ id: user!.id }).make('users.show')
        text = text.replaceAll(
          `@${match}`,
          `<a href="${link}" class="font-semibold hover:underline">${match}</a>`
        )
      }
    }

    return text
  }
}
