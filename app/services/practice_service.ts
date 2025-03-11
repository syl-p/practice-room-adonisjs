import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { dd } from '@adonisjs/core/services/dumper'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

@inject()
export class PracticeService {
  constructor(protected ctx: HttpContext) {}

  async weekAndDurations(current: DateTime, weekStart: DateTime<true>, weekEnd: DateTime<true>) {
    // WEEK AND DURATION
    const groupedByDays = await this.ctx.auth.user
      ?.related('practicedExercises')
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
      .user!.related('practicedExercises')
      .query()
      .preload('exercise')
      .apply((scope) => scope.atSpecificDate(current))

    return { weekAndDurations, practices }
  }
}
