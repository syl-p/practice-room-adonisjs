import type { HttpContext } from '@adonisjs/core/http'

export default class DashboardController {
  async index({ view, auth }: HttpContext) {
    const practices = await auth.user
      ?.related('practicedExercises')
      .query()
      .apply((scope) => scope.today())
    return view.render('pages/dashboard', { practices })
  }
}
