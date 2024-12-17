import User from '#models/user'
import { registerValidator } from '#validators/auth'
import { HttpContext } from '@adonisjs/core/http'

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
    console.log('hello !', auth.use('web').user)
    const data = await request.validateUsing(registerValidator)
    const user = auth.use('web').user
    user?.merge(data)
    await user?.save()

    console.log(user)
    return view.render('pages/auth/edit')
  }
}
