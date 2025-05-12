import ActivityService from '#services/activity_service'
import UserService from '#services/user_service'
import { searchValidator } from '#validators/search'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
@inject()
export default class SearchController {
  constructor(
    protected activityService: ActivityService,
    protected userService: UserService
  ) {}

  async index({ request, view }: HttpContext) {
    const { pattern } = await request.validateUsing(searchValidator)
    const activities = await this.activityService.search(pattern)
    const users = await this.userService.search(pattern)
    return view.render('fragments/search_results', { activities, users })
  }
}
