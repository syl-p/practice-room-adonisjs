import type { HttpContext } from '@adonisjs/core/http'

import Exercise from '#models/exercise'
import { inject } from '@adonisjs/core'
import ExerciseService from '#services/exercise_service'

@inject()
export default class HomeController {
  constructor(private exerciseService: ExerciseService) {}
  // TODO: SHOW LASTED PRACTICED EX AND NEW EX FROM COMMUNITY
  async index({ view, auth }: HttpContext) {
    const exercises = await this.exerciseService.getLatest()

    let lastPracticedExercises: Exercise[] = []

    if (auth.isAuthenticated) {
      const user = auth.getUserOrFail()
      lastPracticedExercises = await this.exerciseService.getLastPracticed(user)

      // dd(lastPracticedExercises)
    }

    return view.render('pages/home', { exercises, lastPracticedExercises })
  }
}
