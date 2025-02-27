import DashboardService from '#services/dashboard_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class DashboardController {
  constructor(protected dashboardService: DashboardService) {}

  async index({ view, auth }: HttpContext) {
    const [practices, dailyExercises, dailyPracticeTime, exerciseTop10] = await Promise.all([
      auth.user
        ?.related('practicedExercises')
        .query()
        .preload('exercise')
        .apply((scope) => scope.today()),
      this.dashboardService.dailyExercises(),
      this.dashboardService.dailyPracticeTime(),
      this.dashboardService.exerciseTop10(),
    ])

    return view.render('pages/dashboard', {
      practices,
      dailyExercises,
      dailyPracticeTime,
      exerciseTop10,
    })
  }
}
