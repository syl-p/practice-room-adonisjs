import Goal from '#models/goal'
import { progressionValidator } from '#validators/progression'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProgressionsController {
  async save({ params, auth, request }: HttpContext) {
    const { value } = await request.validateUsing(progressionValidator)

    const goal = await Goal.findOrFail(params.id)
    const userProgression = await auth.user
      ?.related('progressions')
      .query()
      .where('goal_id', goal.id)
      .first()

    if (!userProgression) {
      // Create a new progression
      await auth.user?.related('progressions').attach({
        [goal.id]: {
          value,
        },
      })
    } else {
      // Update the progression
      await auth.user?.related('progressions').sync({
        [goal.id]: {
          value,
        },
      })
    }

    return true
  }
}
