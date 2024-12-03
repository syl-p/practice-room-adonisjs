import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  async index({ view }: HttpContext) {
    const users = await User.all()
    return view.render('pages/users/index', { users })
  }

  async show({ view, params }: HttpContext) {
    const user = await User.findOrFail(params.id)

    await user.load('practicedExercises', (practicedExercise) => {
      practicedExercise.preload('user')
    })

    // const practicedExercises = await user.related('practicedExercises').query().preload('user')
    return view.render('pages/users/show', { user })
  }
}
