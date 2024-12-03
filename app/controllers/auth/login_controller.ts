import { loginValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'

export default class LoginController {
  async show({ view }: HttpContext) {
    return view.render('pages/auth/login')
  }

  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(loginValidator)
    console.log({ data })
    return response.redirect().toRoute('home')
  }
}
