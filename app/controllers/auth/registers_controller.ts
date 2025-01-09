import User from '#models/user'
import { registerEditValidator, registerValidator } from '#validators/auth'
import { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'

export default class RegistersController {
  async show({ view }: HttpContext) {
    return view.render('pages/auth/register')
  }

  async store({ request, response, auth }: HttpContext) {
    const data = await request.validateUsing(registerValidator)
    const user = await User.create(data)
    await auth.use('web').login(user)
    return response.redirect().toRoute('home')
  }

  async edit({ view, auth }: HttpContext) {
    return view.render('pages/auth/edit')
  }

  async update({ request, view, auth }: HttpContext) {
    const user = auth.use('web').user
    const data = await request.validateUsing(registerEditValidator, {
      meta: {
        userEmail: user!.email,
      },
    })

    if (data.avatar) {
      await data.avatar.move(app.makePath('storage/avatars'))
      auth.user!.avatarUrl = `/avatars/${data.avatar.fileName}`
    } else if (!data.avatarUrl) {
      auth.user!.avatarUrl = null
    }

    if (!data.password) {
      delete data.password
    }

    const { username, bio, email, password } = data

    auth.user?.merge({ username, bio, email, password })
    await auth.user?.save()
    return view.render('pages/auth/edit')
  }
}
