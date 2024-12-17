import type { HttpContext } from '@adonisjs/core/http'

export default class LogoutsController {
  async handle({ response, auth }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect().toRoute('home')
  }
}
