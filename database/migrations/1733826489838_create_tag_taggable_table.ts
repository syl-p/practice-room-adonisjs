import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tag_taggable'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('tag_id').unsigned().references('tags.id').notNullable().onDelete('CASCADE')
      table.integer('taggable_id').unsigned().notNullable()
      table.string('taggable_type').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.unique(['tag_id', 'taggable_id', 'taggable_type'])
      table.index(['taggable_id', 'taggable_type'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
