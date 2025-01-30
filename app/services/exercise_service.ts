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
}
