import type { HttpContext } from '@adonisjs/core/http'
import Exercise from '#models/exercise'
import { practiceTimeValidator } from '#validators/practice'
import { DateTime } from 'luxon'
import PracticedExercise from '#models/practiced_exercise'
import db from '@adonisjs/lucid/services/db'

export default class PracticedExercisesController {
  async index({ auth, request, view }: HttpContext) {
    const { date } = request.qs()

    const current = date ? DateTime.fromISO(date) : DateTime.now().startOf('day')
    const weekStart = current.startOf('week')
    const weekEnd = current.endOf('week')

    // WEEK AND DURATION
    const groupedByDays = await PracticedExercise.query()
      .select(db.raw('DATE(created_at) as date'))
      .sum('duration as total_duration')
      .where('created_at', '>=', weekStart.toSQLDate())
      .andWhere('created_at', '<=', weekEnd.toSQLDate())
      .groupBy('date')

    const myWeek = Array.from({ length: 7 }, (_, i) => weekStart.plus({ days: i }))
    const weekAndDurations = myWeek.map((date) => ({
      date: date.toISO(),
      luxonObject: date,
      duration:
        groupedByDays.find((p) => date.equals(DateTime.fromJSDate(p.$extras.date)))?.$extras
          .total_duration || 0,
    }))

    // PRACTICES FOR CURRENT DATE
    const practices = await auth
      .user!.related('practicedExercises')
      .query()
      .preload('exercise')
      .apply((scope) => scope.atSpecificDate(current))

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
