import type { HttpContext } from '@adonisjs/core/http'
import Exercise from '#models/exercise'
import { practiceTimeValidator } from '#validators/practice'
import { DateTime } from 'luxon'
import PracticedExercise from '#models/practiced_exercise'
import { inject } from '@adonisjs/core'
import { PracticeService } from '#services/practice_service'

@inject()
export default class PracticedExercisesController {
  constructor(protected practiceService: PracticeService) {}

  async index({ request, view }: HttpContext) {
    let { date } = request.qs()
    date = DateTime.fromISO(date)

    const current = date.isValid ? date : DateTime.now().startOf('day')
    const weekStart = current.startOf('week')
    const weekEnd = current.endOf('week')

    const { weekAndDurations, practices } = await this.practiceService.weekAndDurations(
      current,
      weekStart,
      weekEnd
    )

    return view.render('fragments/practices', {
      current: current.toISO(),
      weekAndDurations,
      practices,
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

    return view.render('fragments/practices', {
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

    return view.render('fragments/practices', {
      current: current.toISO(),
      weekAndDurations,
      practices,
    })
  }

  async store({ view, request, params, auth }: HttpContext) {
    const exercise = await Exercise.findByOrFail('id', params.id)
    const { duration } = await request.validateUsing(practiceTimeValidator)

    const user = auth.user
    await user?.related('practicedExercises').create({ exerciseId: exercise.id, duration })

    const practices = await auth.user
      ?.related('practicedExercises')
      .query()
      .apply((scope) => scope.today())
      .sum('duration')

    const time = practices ? practices[0].$extras.sum : 0
    return view.render('fragments/practice_time', { time })
  }

  async destroy({ params, response, session }: HttpContext) {
    const practicedExercise = await PracticedExercise.findOrFail(params.id)
    await practicedExercise.delete()

    session.flash('success', 'Your practice has been deleted')
    return response.redirect().back()
  }
}
