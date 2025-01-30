import User from '#models/user'
import { inject } from '@adonisjs/core'

@inject()
export default class UserService {
  async search(pattern: string | null | undefined) {
    const results = await User.query()
      .where('username', 'like', `%${pattern}%`)
      .orWhere('bio', 'like', `%${pattern}%`)
      .limit(10)
    return results
  }
}
