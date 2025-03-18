import Exercise from '#models/exercise'
import type { HttpContext } from '@adonisjs/core/http'

export default class FavoritesController {
  async index({ auth, view }: HttpContext) {
    await auth.user?.load('favorites')
    return view.render('fragments/favorites')
  }

  async store({ params, auth, view }: HttpContext) {
    const exercise = await Exercise.findOrFail(params.id)
    await auth.user?.related('favorites').save(exercise)
    await auth.user?.load('favorites')

    return view.render('fragments/favorite_btn', { exercise })
  }

  async destroy({ view, params, auth, request, response }: HttpContext) {
    console.log(request.headers()['hx-request'])
    const exercise = await Exercise.findOrFail(params.id)
    await auth.user?.related('favorites').detach([exercise.id])
    await auth.user?.load('favorites')

    if (request.headers()['hx-request']) {
      return view.render('fragments/favorite_btn', { exercise })
    } else {
      return response.redirect().back()
    }
  }
}
