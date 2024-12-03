import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'practiced_exercises'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('duration').notNullable().defaultTo(0)
      table.integer('user_id').unsigned().references('users.id').notNullable()
      table.integer('exercise_id').unsigned().references('exercises.id').notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
