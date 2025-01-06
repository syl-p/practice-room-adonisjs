import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  async index({ view }: HttpContext) {
    const users = await User.all()
    return view.render('pages/users/index', { users })
  }

  async practiceTime({ view, auth }: HttpContext) {
    const practices = await auth.user
      ?.related('practicedExercises')
      .query()
      .apply((scope) => scope.today())

    const time = practices?.reduce((accumulator, practice) => accumulator + practice.duration, 0)
    return view.render('fragments/practice_time', { time })
  }

  async show({ view, params }: HttpContext) {
    const user = await User.findOrFail(params.id)

    const practicedExercises = await user
      .related('practicedExercises')
      .query()
      .preload('user')
      .preload('exercise')
    await user.load('followers')
    return view.render('pages/users/show', { user, practicedExercises })
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
}
