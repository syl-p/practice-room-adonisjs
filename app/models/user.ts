import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import Activity from '#models/activity'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import PracticedActivity from '#models/practiced_activity'
import Medium from './medium.js'
import { DbRememberMeTokensProvider } from '@adonisjs/auth/session'
import Progression from './progression.js'
import Goal from './goal.js'
import Notification from './notification.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare username: string

  @column()
  declare email: string

  @column()
  declare avatarUrl: string | null

  @column()
  declare bio: string | null

  @column({ serializeAs: null })
  declare password: string

  @hasMany(() => Activity)
  declare activities: HasMany<typeof Activity>

  @hasMany(() => Medium)
  declare media: HasMany<typeof Medium>

  @hasMany(() => PracticedActivity)
  declare practicedActivities: HasMany<typeof PracticedActivity>

  @hasMany(() => Notification)
  declare notifications: HasMany<typeof Notification>

  @manyToMany(() => Goal, {
    pivotTable: 'progressions',
    pivotForeignKey: 'user_id',
    pivotRelatedForeignKey: 'goal_id',
    pivotTimestamps: true,
    pivotColumns: ['value'],
  })
  declare progressions: ManyToMany<typeof Goal>

  @manyToMany(() => User, {
    pivotTable: 'followers',
    pivotForeignKey: 'follower_id',
    pivotRelatedForeignKey: 'following_id',
    pivotTimestamps: true,
  })
  declare followings: ManyToMany<typeof User>

  @manyToMany(() => User, {
    pivotTable: 'followers',
    pivotForeignKey: 'following_id',
    pivotRelatedForeignKey: 'follower_id',
    pivotTimestamps: true,
  })
  declare followers: ManyToMany<typeof User>

  @manyToMany(() => Activity, {
    pivotTable: 'favorites',
    pivotForeignKey: 'user_id',
    pivotRelatedForeignKey: 'activity_id',
    pivotTimestamps: true,
  })
  declare favorites: ManyToMany<typeof Activity>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  static rememberMeTokens = DbRememberMeTokensProvider.forModel(User)
}
