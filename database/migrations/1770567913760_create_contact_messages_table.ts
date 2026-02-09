import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'contact_messages'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('first_name', 100).notNullable()
      table.string('last_name', 100).notNullable()
      table.string('email', 254).notNullable()
      table.string('phone', 20).nullable()
      table.string('subject', 300).notNullable()
      table.text('message').notNullable()
      table.boolean('is_read').defaultTo(false)

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
