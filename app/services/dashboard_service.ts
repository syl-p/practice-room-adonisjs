import Exercise from '#models/exercise'
import PracticedExercise from '#models/practiced_exercise'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { log } from 'console'
type DailyStat = {
  progress: number
  goal: number
  label: string
}

@inject()
export default class DashboardService {
  constructor(protected ctx: HttpContext) {}

  async dailyExercises(): Promise<DailyStat> {
    const nbr = await PracticedExercise.query()
      .apply((scope) => scope.today)
      .countDistinct('exercise_id')

    return {
      progress: nbr[0].$extras.count > 3 ? 3 : nbr[0].$extras.count,
      goal: 3,
      label: 'Pratiquer 3 exercices',
    }
  }

  async dailyPracticeTime(): Promise<DailyStat> {
    return {
      progress: 50,
      goal: 90,
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
