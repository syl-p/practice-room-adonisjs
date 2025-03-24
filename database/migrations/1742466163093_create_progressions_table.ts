import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'progressions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('users.id').notNullable().onDelete('CASCADE')
      table.integer('goal_id').unsigned().references('goals.id').notNullable().onDelete('CASCADE')
      table.integer('value').defaultTo(0)
      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.unique(['user_id', 'goal_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
