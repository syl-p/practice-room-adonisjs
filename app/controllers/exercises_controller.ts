import type { HttpContext } from '@adonisjs/core/http'
import Exercise from '#models/exercise'
import User from '#models/user'

export default class ExercisesController {
  async index({ view }: HttpContext) {
    const exercises = await Exercise.query()
      .preload('user')
      .apply((scope) => scope.public())
      .orderBy('createdAt', 'desc')
    return view.render('pages/exercises/index', { exercises })
  }

  async show({ view, params }: HttpContext) {
    const exercise = await Exercise.findByOrFail('slug', params.slug)
    return view.render('pages/exercises/show', { exercise })
  }

  async store({}: HttpContext) {}

  async delete({}: HttpContext) {}

  async addToPractice({ response, params }: HttpContext) {
    const exercise = await Exercise.findByOrFail('id', params.id)
    const user = await User.query().first()
    await user.related('practicedExercises').attach([exercise.id])

    response.redirect().toPath(`/users/${user.id}`)
  }
}
