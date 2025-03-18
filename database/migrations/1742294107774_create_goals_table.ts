import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'goals'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('exercise_id')
        .unsigned()
        .references('exercises.id')
        .notNullable()
        .onDelete('CASCADE')
      table.integer('goal')
      table.integer('step')
      table.string('label')
      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.unique('exercise_id')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
