import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'realisations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('slug', 200).notNullable().unique()
      table.string('title', 300).notNullable()
      table.text('description').notNullable()
      table.string('client', 200).nullable()
      table.string('location', 300).notNullable()
      table.string('city', 100).notNullable()
      table.date('project_date').notNullable()
      table.string('duration', 100).nullable()
      table.string('surface', 100).nullable()
      table.enum('pole', ['enveloppe', 'amenagement']).notNullable()
      table.json('services').notNullable()
      table.boolean('featured').defaultTo(false)
      table.boolean('published').defaultTo(false)
      table.string('seo_title', 300).nullable()
      table.text('seo_description').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
