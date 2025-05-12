import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'

export default class UsersController {
  async index({ view }: HttpContext) {
    const users = await User.all()
    return view.render('pages/users/index', { users })
  }

  async show({ view, params }: HttpContext) {
    const user = await User.findOrFail(params.id)
    await user.load('followers')
    const activities = await user.related('activities').query().preload('user')
    return view.render('pages/users/show', { user, activities })
  }

  async follow({ view, params, auth }: HttpContext) {
    const user = await User.findOrFail(params.id)
    await user.related('followers').attach([auth.user!.id])
    await user.load('followers')
    return view.render('fragments/user_follow_unfollow', { user })
  }

  async unfollow({ view, params, auth }: HttpContext) {
    const user = await User.findOrFail(params.id)
    await user.related('followers').detach([auth.user!.id])
    await user.load('followers')
    return view.render('fragments/user_follow_unfollow', { user })
  }

  async avatar({ response, params }: HttpContext) {
    return response.download(app.makePath('storage/avatars', params.filename))
  }
}
