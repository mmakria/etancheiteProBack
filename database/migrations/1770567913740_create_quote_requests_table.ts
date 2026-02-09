import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'quote_requests'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('first_name', 100).notNullable()
      table.string('last_name', 100).notNullable()
      table.string('email', 254).notNullable()
      table.string('phone', 20).notNullable()
      table.string('company', 200).nullable()
      table.string('service_type', 100).notNullable()
      table.enum('pole', ['enveloppe', 'amenagement']).notNullable()
      table.text('project_description').notNullable()
      table.string('project_address', 300).nullable()
      table.string('project_city', 100).nullable()
      table.string('project_postal_code', 5).nullable()
      table.enum('preferred_contact_method', ['phone', 'email', 'both']).defaultTo('phone')
      table.enum('budget', ['less_5k', '5k_15k', '15k_30k', '30k_50k', '50k_100k', 'more_100k']).nullable()
      table.enum('urgency', ['low', 'medium', 'high', 'urgent']).defaultTo('medium')
      table.enum('status', ['pending', 'contacted', 'quoted', 'accepted', 'rejected']).defaultTo('pending')
      table.json('photo_paths').nullable()
      table.text('internal_notes').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
