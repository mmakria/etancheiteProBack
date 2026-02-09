import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'realisation_images'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('realisation_id').unsigned().notNullable().references('id').inTable('realisations').onDelete('CASCADE')
      table.string('url', 500).notNullable()
      table.string('alt', 300).notNullable()
      table.string('caption', 500).nullable()
      table.boolean('is_primary').defaultTo(false)
      table.integer('sort_order').defaultTo(0)

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
