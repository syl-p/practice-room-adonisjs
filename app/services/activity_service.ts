import ActivityStatuses from '#enums/activity_statuses'
import Activity from '#models/activity'
import User from '#models/user'
import { inject } from '@adonisjs/core'

@inject()
export default class ActivityService {
  async search(pattern: string | null | undefined) {
    if (!pattern) return []
    const results = await Activity.query()
      .apply((scope) => scope.public())
      .where('title', 'ILIKE', `%${pattern}%`)
      .orWhere('content', 'ILIKE', `%${pattern}%`)
      .orWhereHas('tags', (builder) => {
        builder.where('label', 'ILIKE', `%${pattern}%`)
      })
      .limit(10)
    return results
  }

  async getLatest(limit = 10) {
    return await Activity.query()
      .preload('user')
      .preload('tags')
      .apply((scope) => scope.public())
      .orderBy('createdAt', 'desc')
      .limit(limit)
  }

  async getLastPracticed(user: User, limit = 10) {
    if (!user) return []
    return await Activity.query()
      .preload('user')
      .preload('goal', (builder) => {
        builder.leftJoin('progressions', 'progressions.goal_id', 'goals.id')
      })
      .join('practiced_activities', 'practiced_activities.activity_id', 'activities.id')
      .where('practiced_activities.user_id', user.id)
      .select('activities.*')
      .distinctOn('activities.id')
      .orderBy('activities.id')
      .limit(limit)
  }
}
