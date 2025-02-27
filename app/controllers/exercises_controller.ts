import type { HttpContext } from '@adonisjs/core/http'
import Exercise from '#models/exercise'
import { exerciseValidator } from '#validators/exercise'

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
    await exercise.load('tags')
    await exercise.load('media')
    const comments = await exercise
      .related('comments')
      .query()
      .orderBy('createdAt', 'desc')
      .preload('user')
    return view.render('pages/exercises/show', { exercise, comments })
  }

  async edit({ view, params }: HttpContext) {
    const exercise = await Exercise.findOrFail(params.id)
    return view.render('pages/exercises/edit', { exercise })
  }

  async update({ request, response, params }: HttpContext) {
    const exercise = await Exercise.findOrFail(params.id)
    const { title, content } = await request.validateUsing(exerciseValidator)
    exercise.merge({ title, content })

    await exercise.save()
    return response.redirect().toRoute('exercises.edit', { id: exercise.id })
  }

  async store({}: HttpContext) {}

  async delete({}: HttpContext) {}
}
