import type { HttpContext } from '@adonisjs/core/http'
import Exercise from '#models/exercise'
import CacheService from '#services/cache_service'

export default class ExercisesController {
  async index({ view }: HttpContext) {
    const exercises = await Exercise.query()
      .preload('user')
      .preload('tags')
      .apply((scope) => scope.public())
      .orderBy('createdAt', 'desc')
    return view.render('pages/exercises/index', { exercises })
  }

  async show({ view, params }: HttpContext) {
    const exercise = await Exercise.findByOrFail('slug', params.slug)
    await exercise.load('user')
    const comments = await exercise
      .related('comments')
      .query()
      .orderBy('createdAt', 'desc')
      .preload('user')
    return view.render('pages/exercises/show', { exercise, comments })
  }

  async store({}: HttpContext) {}

  async delete({}: HttpContext) {}

  async addToPractice({ view, params, auth }: HttpContext) {
    const exercise = await Exercise.findByOrFail('id', params.id)
    const user = auth.user
    await user?.related('practicedExercises').create({ exerciseId: exercise.id, duration: 90 })

    const practices = await auth.user
      ?.related('practicedExercises')
      .query()
      .apply((scope) => scope.today())

    await CacheService.delete(`practiced_time:${user?.id}`)
    const time = practices?.reduce((accumulator, practice) => accumulator + practice.duration, 0)
    return view.render('fragments/practice_time', { time })
  }
}
