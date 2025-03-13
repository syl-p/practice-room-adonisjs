import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import Exercise from '#models/exercise'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import PracticedExercise from '#models/practiced_exercise'
import Medium from './medium.js'
import { DbRememberMeTokensProvider } from '@adonisjs/auth/session'

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

  @hasMany(() => Exercise)
  declare exercises: HasMany<typeof Exercise>

  @hasMany(() => Medium)
  declare media: HasMany<typeof Medium>

  @hasMany(() => PracticedExercise)
  declare practicedExercises: HasMany<typeof PracticedExercise>

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

  @manyToMany(() => Exercise, {
    pivotTable: 'favorites',
    pivotForeignKey: 'user_id',
    pivotRelatedForeignKey: 'exercise_id',
    pivotTimestamps: true,
  })
  declare favorites: ManyToMany<typeof Exercise>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  static rememberMeTokens = DbRememberMeTokensProvider.forModel(User)
}
