import ExerciseService from '#services/exercise_service'
import UserService from '#services/user_service'
import { searchValidator } from '#validators/search'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
@inject()
export default class SearchController {
  constructor(
    protected exerciseService: ExerciseService,
    protected userService: UserService
  ) {}

  async index({ request, view }: HttpContext) {
    const { pattern } = await request.validateUsing(searchValidator)
    const exercises = await this.exerciseService.search(pattern)
    const users = await this.userService.search(pattern)
    return view.render('fragments/search_results', { exercises, users })
  }
}
