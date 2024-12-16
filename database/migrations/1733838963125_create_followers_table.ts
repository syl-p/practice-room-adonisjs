import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'followers'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('follower_id')
        .unsigned()
        .references('users.id')
        .notNullable()
        .onDelete('CASCADE')
      table
        .integer('following_id')
        .unsigned()
        .references('users.id')
        .notNullable()
        .onDelete('CASCADE')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
