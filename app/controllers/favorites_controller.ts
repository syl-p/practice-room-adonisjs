import Exercise from '#models/exercise'
import type { HttpContext } from '@adonisjs/core/http'

export default class FavoritesController {
  async index({ auth, view }: HttpContext) {
    await auth.user?.load('favorites')
    return view.render('fragments/favorites')
  }

  async store({ params, auth, response }: HttpContext) {
    const exercise = await Exercise.findOrFail(params.id)
    await auth.user?.related('favorites').save(exercise)

    return response.redirect().toRoute('favorites')
  }

  async destroy({ response, params, auth }: HttpContext) {
    const exercise = await Exercise.findOrFail(params.id)
    await auth.user?.related('favorites').detach([exercise.id])

    return response.redirect().back()
  }
}
