import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeCreate,
  belongsTo,
  column,
  computed,
  hasMany,
  hasOne,
  manyToMany,
  scope,
} from '@adonisjs/lucid/orm'
import ActivityStatuses from '#enums/activity_statuses'
import stringHelpers from '@adonisjs/core/helpers/string'
import User from './user.js'
import type { BelongsTo, HasMany, HasOne, ManyToMany } from '@adonisjs/lucid/types/relations'
import Tag from './tag.js'
import Comment from '#models/comment'
import CommentableType from '#enums/commentable_types'
import PracticedActivity from '#models/practiced_activity'
import Medium from '#models/medium'
import Goal from '#models/goal'

export default class Activity extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare content: string

  @column()
  declare slug: string

  @column()
  declare posterUrl: string | null

  @column()
  declare status: ActivityStatuses

  @column()
  declare userId: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => PracticedActivity)
  declare practiced: HasMany<typeof PracticedActivity>

  @hasMany(() => Comment, {
    foreignKey: 'commentableId',
    onQuery: (query) => query.where('commentable_type', CommentableType.ACTIVITY),
  })
  declare comments: HasMany<typeof Comment>

  @manyToMany(() => Medium, {
    pivotTable: 'activity_medium',
    pivotForeignKey: 'activity_id',
    pivotRelatedForeignKey: 'medium_id',
    pivotTimestamps: true,
  })
  declare media: ManyToMany<typeof Medium>

  @manyToMany(() => Tag, {
    pivotTable: 'tag_taggable',
    pivotForeignKey: 'taggable_id',
    pivotRelatedForeignKey: 'tag_id',
    // pivotTimestamps: true,
  })
  declare tags: ManyToMany<typeof Tag>

  @hasOne(() => Goal)
  declare goal: HasOne<typeof Goal>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @computed()
  get publishedAt() {
    return this.createdAt.setLocale('fr').toFormat('dd LLLL yyyy à HH:mm')
  }

  @beforeCreate()
  static async makeSlug(activity: Activity) {
    if (activity.slug) return
    const slug = stringHelpers.slug(activity.title, {
      replacement: '-',
      lower: true,
      strict: true,
    })

    const rows = await Activity.query()
      .select('slug')
      .whereRaw('lower(??) = ?', ['slug', slug])
      .orWhereRaw('lower(??) like ?', ['slug', `${slug}-%`])

    if (rows.length < 1) {
      activity.slug = slug
      return
    }

    // DUPLICATION ? go increment
    const increments = rows.reduce<number[]>((results, row) => {
      const tokens = row.slug.toLowerCase().split(`${slug}-`)

      if (tokens.length < 2) {
        return results
      }

      const token = Number(tokens.at(1))

      if (!Number.isNaN(token)) {
        results.push(token)
      }

      return results
    }, [])

    const increment = increments.length ? Math.max(...increments) : 1
    activity.slug = `${slug}-${increment}`
    return
  }

  static public = scope((query) => {
    query.where('status', ActivityStatuses.PUBLIC)
  })

  static draft = scope((query) => {
    query.where('status', ActivityStatuses.DRAFT)
  })

  static private = scope((query) => {
    query.where('status', ActivityStatuses.NOT_REFERENCED)
  })
}
