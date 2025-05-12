import Activity from '#models/activity'
import type { HttpContext } from '@adonisjs/core/http'

export default class FavoritesController {
  async index({ auth, view }: HttpContext) {
    await auth.user?.load('favorites')
    return view.render('fragments/favorites')
  }

  async store({ params, auth, view }: HttpContext) {
    const activity = await Activity.findOrFail(params.id)
    await auth.user?.related('favorites').save(activity)
    await auth.user?.load('favorites')

    return view.render('fragments/favorite_btn', { activity })
  }

  async destroy({ view, params, auth, request, response }: HttpContext) {
    console.log(request.headers()['hx-request'])
    const activity = await Activity.findOrFail(params.id)
    await auth.user?.related('favorites').detach([activity.id])
    await auth.user?.load('favorites')

    if (request.headers()['hx-request']) {
      return view.render('fragments/favorite_btn', { activity })
    } else {
      return response.redirect().back()
    }
  }
}
