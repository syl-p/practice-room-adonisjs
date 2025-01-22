// import type { HttpContext } from '@adonisjs/core/http'

import type { HttpContext } from '@adonisjs/core/http'
import Exercise from '#models/exercise'
import { practiceTimeValidator } from '#validators/practice'

export default class PracticedExercisesController {
  async store({ view, request, params, auth }: HttpContext) {
    const exercise = await Exercise.findByOrFail('id', params.id)
    const { duration } = await request.validateUsing(practiceTimeValidator)

    const user = auth.user
    await user?.related('practicedExercises').create({ exerciseId: exercise.id, duration })

    const practices = await auth.user
      ?.related('practicedExercises')
      .query()
      .apply((scope) => scope.today())

    const time = practices?.reduce((accumulator, practice) => accumulator + practice.duration, 0)
    return view.render('fragments/practice_time', { time })
  }
}
