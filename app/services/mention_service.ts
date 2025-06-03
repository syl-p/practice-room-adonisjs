import User from '#models/user'
import router from '@adonisjs/core/services/router'

export default class MentionService {
  static async mentionedUsers(text: string) {
    const matches = text.matchAll(/@(\w+)/g)
    const mentions = new Set(Array.from(matches).map((match) => match[1]))

    return await User.query().where('username', 'in', Array.from(mentions))
  }

  static async convertMentionsToLinks(text: string, mentions: User[] = []) {
    for (const user of mentions) {
      if (user) {
        const link = router.builder().params({ id: user!.id }).make('users.show')
        text = text.replaceAll(
          `@${user.username}`,
          `<a href="${link}" class="font-semibold hover:underline">${user.username}</a>`
        )
      }
    }

    return text
  }
}
