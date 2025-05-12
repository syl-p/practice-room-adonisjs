import User from '#models/user'
import Activity from '#models/activity'
import { allowGuest, BasePolicy } from '@adonisjs/bouncer'
import type { AuthorizerResponse } from '@adonisjs/bouncer/types'
import ActivityStatuses from '#enums/activity_statuses'

export default class ActivityPolicy extends BasePolicy {
  create(user: User): AuthorizerResponse {
    return user.id !== null
  }

  @allowGuest()
  show(user: User | null, activity: Activity): AuthorizerResponse {
    if (activity.status === ActivityStatuses.PUBLIC) {
      return true
    }

    if (!user) {
      return false
    }

    return user.id === activity.userId
  }

  edit(user: User, activity: Activity): AuthorizerResponse {
    return user.id === activity.userId
  }

  delete(user: User, activity: Activity): AuthorizerResponse {
    return user.id === activity.userId
  }
}
