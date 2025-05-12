import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'goals'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('activity_id')
        .unsigned()
        .references('activities.id')
        .notNullable()
        .onDelete('CASCADE')
      table.integer('objective').notNullable()
      table.integer('step').defaultTo(1)
      table.string('label').notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.unique('activity_id')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
