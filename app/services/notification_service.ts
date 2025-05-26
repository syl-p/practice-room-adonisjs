import NotificationType from '#enums/notification_type'
import Notification from '#models/notification'
import User from '#models/user'
import transmit from '@adonisjs/transmit/services/main'
import edge from 'edge.js'

export class NotificationService {
  static channel = 'user/:id/notifications'

  static async do(type: NotificationType, user: User, state: { [p: string]: any }) {
    const dataFinal = this.getData(type, state)

    // Persist Notif
    const notification = new Notification()
    notification.merge({
      data: dataFinal,
      type,
    })

    await user.related('notifications').save(notification)

    // Transmit it
    const finalChannel = this.channel.replace(':id', user.id.toString())
    const html = await this.render(notification)
    transmit.broadcast(finalChannel, { html })
  }

  static async render(notification: Notification) {
    const html = await edge.render('components/notifications/item', { notification })
    return html
  }

  static getData(type: NotificationType, data: { [p: string]: any }) {
    switch (type) {
      case NotificationType.COMMENT:
        return {
          comment: data.comment,
          href: data.href,
          message: 'a posté un commentaire sur une de vos activités',
          createdAt: data.createdAt,
        }
      case NotificationType.MENTION:
        return {
          comment: data.comment,
          href: data.href,
          message: 'vous a mentionné dans un commentaire',
          createdAt: data.createdAt,
        }
      default:
        break
    }
  }
}
