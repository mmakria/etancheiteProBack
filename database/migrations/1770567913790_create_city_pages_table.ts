import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'city_pages'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('slug', 200).notNullable().unique()
      table.string('name', 200).notNullable()
      table.string('department', 200).notNullable()
      table.string('department_code', 3).notNullable()
      table.json('postal_codes').nullable()
      table.string('seo_title', 300).nullable()
      table.text('seo_description').nullable()
      table.text('intro_content').nullable()
      table.text('main_content').nullable()
      table.json('keywords').nullable()
      table.json('nearby_services').nullable()
      table.json('neighbor_cities').nullable()
      table.boolean('published').defaultTo(false)

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
