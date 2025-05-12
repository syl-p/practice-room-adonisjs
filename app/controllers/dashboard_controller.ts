import DashboardService from '#services/dashboard_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class DashboardController {
  constructor(protected dashboardService: DashboardService) {}

  async index({ view, auth }: HttpContext) {
    const [practices, dailyActivities, dailyPracticeTime, activityTop10] = await Promise.all([
      auth.user
        ?.related('practicedActivities')
        .query()
        .preload('activity')
        .apply((scope) => scope.today()),
      this.dashboardService.dailyActivities(),
      this.dashboardService.dailyPracticeTime(),
      this.dashboardService.activityTop10(),
    ])

    return view.render('pages/dashboard', {
      practices,
      dailyActivities,
      dailyPracticeTime,
      activityTop10,
    })
  }
}
