import { BaseSchema } from '@adonisjs/lucid/schema'
import ActivityStatuses from '#enums/activity_statuses'

export default class extends BaseSchema {
  protected tableName = 'activities'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('status').notNullable().defaultTo(ActivityStatuses.DRAFT)
      table.integer('user_id').unsigned().references('users.id').notNullable()
      table.string('title').notNullable()
      table.text('content').notNullable()
      table.string('slug').notNullable()
      table.string('poster_url')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
