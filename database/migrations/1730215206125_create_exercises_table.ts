import { BaseSchema } from '@adonisjs/lucid/schema'
import ExerciseStatuses from '#enums/exercise_statuses'

export default class extends BaseSchema {
  protected tableName = 'exercises'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('status_id')
        .unsigned()
        .references('exercise_statuses.id')
        .notNullable()
        .defaultTo(ExerciseStatuses.DRAFT)
      table.integer('user_id').unsigned().references('users.id').notNullable()
      table.string('title')
      table.text('content')
      table.string('slug')
      table.string('poster_url').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
