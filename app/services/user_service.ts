import User from '#models/user'

export default class UserService {
  static async search(pattern: string | null | undefined) {
    const results = await User.query()
      .where('username', 'like', `%${pattern}%`)
      .orWhere('bio', 'like', `%${pattern}%`)
    return results
  }
}
