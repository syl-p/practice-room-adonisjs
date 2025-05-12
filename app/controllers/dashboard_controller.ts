import DashboardService from '#services/dashboard_service'
import { PracticeService } from '#services/practice_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

@inject()
export default class DashboardController {
  constructor(protected practiceService: PracticeService) {}

  async index({ view }: HttpContext) {
    const activityTop10 = this.practiceService.top10Activities()

    return view.render('pages/dashboard', {
      activityTop10,
    })
  }

  async byDate({ request, view }: HttpContext) {
    let { date } = request.qs()
    date = DateTime.fromISO(date)

    const current = date.isValid ? date : DateTime.now().startOf('day')
    const weekStart = current.startOf('week')
    const weekEnd = current.endOf('week')

    const [dailyActivities, dailyPracticeTime, { weekAndDurations, practices }] = await Promise.all(
      [
        this.practiceService.dailyActivities(current),
        this.practiceService.dailyPracticeTime(current),
        await this.practiceService.weekAndDurations(current, weekStart, weekEnd),
      ]
    )

    return view.render('fragments/dashboard_content', {
      current: current.toISO(),
      weekAndDurations,
      practices,
      dailyActivities,
      dailyPracticeTime,
    })
  }

  async previousWeek({ view, request }: HttpContext) {
    const { date } = request.qs()
    const current = DateTime.fromISO(date).minus({ weeks: 1 }).startOf('week')
    const weekStart = current.startOf('week')
    const weekEnd = current.endOf('week')

    const { weekAndDurations, practices } = await this.practiceService.weekAndDurations(
      current,
      weekStart,
      weekEnd
    )

    return view.render('fragments/dashboard_content', {
      current: current.toISO(),
      weekAndDurations,
      practices,
    })
  }

  async nextWeek({ request, view }: HttpContext) {
    const { date } = request.qs()

    const current = DateTime.fromISO(date).plus({ weeks: 1 }).startOf('week')
    const weekStart = current.startOf('week')
    const weekEnd = current.endOf('week')

    const { weekAndDurations, practices } = await this.practiceService.weekAndDurations(
      current,
      weekStart,
      weekEnd
    )

    return view.render('fragments/dashboard_content', {
      current: current.toISO(),
      weekAndDurations,
      practices,
    })
  }
}
