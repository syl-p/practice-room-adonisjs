import Exercise from '#models/exercise'

export default class ExerciseService {
  static async search(pattern: string | null | undefined) {
    const results = await Exercise.query()
      .where('title', 'ILIKE', `%${pattern}%`)
      // .orWhere('description', 'ILIKE', `%${pattern}%`)
      .orWhere('content', 'ILIKE', `%${pattern}%`)
    return results
  }
}
