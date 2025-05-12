import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'favorites'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('users.id').notNullable().onDelete('CASCADE')
      table
        .integer('activity_id')
        .unsigned()
        .references('activities.id')
        .notNullable()
        .onDelete('CASCADE')
      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.unique(['user_id', 'activity_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
