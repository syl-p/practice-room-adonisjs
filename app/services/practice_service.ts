import Activity from '#models/activity'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

type DailyStat = {
  progress: number
  goal: number
  label: string
}

@inject()
export class PracticeService {
  constructor(protected ctx: HttpContext) {}

  async top10Activities(): Promise<Activity[]> {
    return await Activity.query()
      .has('practiced')
      .withCount('practiced', (query) => {
        query
          .where('user_id', this.ctx.auth.user!.id)
          .where('duration', '>', 0)
          .as('practiceAssociatedTime')
      })
      .preload('practiced')
      .orderBy('practiceAssociatedTime', 'desc')
      .limit(10)
  }

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

  async weekAndDurations(current: DateTime, weekStart: DateTime<true>, weekEnd: DateTime<true>) {
    // WEEK AND DURATION
    const groupedByDays = await this.ctx.auth.user
      ?.related('practicedActivities')
      .query()
      .select(db.raw('DATE(created_at) as date'))
      .sum('duration as total_duration')
      .where('created_at', '>=', weekStart.toSQLDate())
      .andWhere('created_at', '<=', weekEnd.toSQLDate())
      .groupBy('date')

    // dd(groupedByDays)

    // CONSTRUCT MY WEEK
    const myWeek = Array.from({ length: 7 }, (_, i) => weekStart.plus({ days: i }))

    const weekAndDurations = myWeek.map((wd) => ({
      date: wd.toISO(),
      luxonObject: wd,
      duration:
        groupedByDays?.find((p) => wd.equals(DateTime.fromJSDate(p.$extras.date)))?.$extras
          .total_duration || 0,
    }))

    // PRACTICES FOR CURRENT DATE
    const practices = await this.ctx.auth
      .user!.related('practicedActivities')
      .query()
      .preload('activity', (query) => query.preload('user'))
      .apply((scope) => scope.atSpecificDate(current))

    return { weekAndDurations, practices }
  }
}
