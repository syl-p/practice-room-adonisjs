import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'practiced_activitys'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('duration').notNullable().defaultTo(0)
      table.integer('user_id').unsigned().references('users.id').notNullable()
      table.integer('activity_id').unsigned().references('activities.id').notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
