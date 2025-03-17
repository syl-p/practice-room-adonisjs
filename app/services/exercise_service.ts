import Exercise from '#models/exercise'
import { inject } from '@adonisjs/core'

@inject()
export default class ExerciseService {
  async search(pattern: string | null | undefined) {
    const results = await Exercise.query()
      .where('title', 'ILIKE', `%${pattern}%`)
      // .orWhere('description', 'ILIKE', `%${pattern}%`)
      .orWhere('content', 'ILIKE', `%${pattern}%`)
      .limit(10)
    return results
  }

  async getLatest(limit = 10) {
    return await Exercise.query()
      .preload('user')
      .preload('tags')
      .apply((scope) => scope.public())
      .orderBy('createdAt', 'desc')
      .limit(limit)
  }

  async getLastPracticed(user: User, limit = 10) {
    if (!user) return []
    return await Exercise.query()
      .preload('user')
      .preload('tags')
      .join('practiced_exercises', 'practiced_exercises.exercise_id', 'exercises.id')
      .where('practiced_exercises.user_id', user.id)
      .select('exercises.*')
      .orderBy('practiced_exercises.updated_at', 'desc')
      .limit(10)
  }
}
