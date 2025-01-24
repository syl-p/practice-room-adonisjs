import Exercise from '#models/exercise'
import ExerciseService from '#services/exercise_service'
import UserService from '#services/user_service'
import { searchValidator } from '#validators/search'
import type { HttpContext } from '@adonisjs/core/http'

export default class SearchController {
  async index({ request, view }: HttpContext) {
    const { pattern } = await request.validateUsing(searchValidator)
    const exercises = await ExerciseService.search(pattern)
    const users = await UserService.search(pattern)
    return view.render('fragments/search_results', { exercises, users })
  }
}
