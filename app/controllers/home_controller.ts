import type { HttpContext } from '@adonisjs/core/http'

import Activity from '#models/activity'
import { inject } from '@adonisjs/core'
import ActivityService from '#services/activity_service'

@inject()
export default class HomeController {
  constructor(private activityService: ActivityService) {}
  // TODO: SHOW LASTED PRACTICED EX AND NEW EX FROM COMMUNITY
  async index({ view, auth }: HttpContext) {
    const activities = await this.activityService.getLatest()

    let lastPracticedActivities: Activity[] = []

    if (auth.isAuthenticated) {
      const user = auth.getUserOrFail()
      lastPracticedActivities = await this.activityService.getLastPracticed(user)

      // dd(lastPracticedActivities)
    }

    return view.render('pages/home', { activities, lastPracticedActivities })
  }
}
