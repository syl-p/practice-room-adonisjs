import DashboardService from '#services/dashboard_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class DashboardController {
  constructor(protected dashboardService: DashboardService) {}

  async index({ view, auth }: HttpContext) {
    const practices = await auth.user
      ?.related('practicedExercises')
      .query()
      .preload('exercise')
      .apply((scope) => scope.today())

    const dailyExercises = await this.dashboardService.dailyExercises()
    const dailyPracticeTime = await this.dashboardService.dailyPracticeTime()
    const exerciseTop10 = await this.dashboardService.exerciseTop10()

    return view.render('pages/dashboard', {
      practices,
      dailyExercises,
      dailyPracticeTime,
      exerciseTop10,
    })
  }
}
