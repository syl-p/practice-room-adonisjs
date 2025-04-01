import Exercise from '#models/exercise'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

type DailyStat = {
  progress: number
  goal: number
  label: string
}

@inject()
export default class DashboardService {
  constructor(protected ctx: HttpContext) {}

  async dailyExercises(): Promise<DailyStat> {
    const practices = await this.ctx.auth.user
      ?.related('practicedExercises')
      .query()
      .apply((scope) => scope.today())
      .countDistinct('exercise_id')

    return {
      progress: practices?.[0].$extras.count ? practices[0].$extras.count : 0,
      goal: 3,
      label: 'Pratiquer 3 exercices',
    }
  }

  async dailyPracticeTime(): Promise<DailyStat> {
    const practices = await this.ctx.auth.user
      ?.related('practicedExercises')
      .query()
      .apply((scope) => scope.today())
      .sum('duration')

    return {
      progress: practices?.[0].$extras.sum ? practices[0].$extras.sum : 0,
      goal: 600,
      label: 'Pratiquer au moins 10 minutes',
    }
  }

  async exerciseTop10(): Promise<Exercise[]> {
    const exercises = await Exercise.query()
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

    return exercises
  }
}
