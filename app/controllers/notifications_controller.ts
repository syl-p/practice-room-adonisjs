import type { HttpContext } from '@adonisjs/core/http'

export default class NotificationsController {
  async index({ auth, view }: HttpContext) {
    const notifications = await auth.user
      ?.related('notifications')
      .query()
      .orderBy('created_at', 'desc')
      .limit(5)
    return view.render('fragments/notifications', { notifications })
  }
}
