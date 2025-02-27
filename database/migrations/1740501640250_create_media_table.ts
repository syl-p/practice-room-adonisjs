import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'media'
  // media is plural of medium

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('file_url').notNullable()
      table.string('description').nullable()
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
