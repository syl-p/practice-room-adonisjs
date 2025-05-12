import Activity from '#models/activity'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

type DailyStat = {
  progress: number
  goal: number
  label: string
}

@inject()
export default class DashboardService {
  constructor(protected ctx: HttpContext) {}

  async dailyActivities(date: DateTime): Promise<DailyStat> {
    const practices = await this.ctx.auth.user
      ?.related('practicedActivities')
      .query()
      .apply((scope) => scope.atSpecificDate(date))
      .countDistinct('activity_id')

    return {
      progress: practices?.[0].$extras.count ? practices[0].$extras.count : 0,
      goal: 3,
      label: 'Pratiquer 3 activités différentes',
    }
  }

  async dailyPracticeTime(date: DateTime): Promise<DailyStat> {
    const practices = await this.ctx.auth.user
      ?.related('practicedActivities')
      .query()
      .apply((scope) => scope.atSpecificDate(date))
      .sum('duration')

    return {
      progress: practices?.[0].$extras.sum ? practices[0].$extras.sum : 0,
      goal: 600,
      label: 'Pratiquer au moins 10 minutes',
    }
  }
}
