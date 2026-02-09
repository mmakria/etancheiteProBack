import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'leak_detections'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('first_name', 100).notNullable()
      table.string('last_name', 100).notNullable()
      table.string('email', 254).notNullable()
      table.string('phone', 20).notNullable()
      table.string('address', 300).notNullable()
      table.string('city', 100).notNullable()
      table.string('postal_code', 5).notNullable()
      table.enum('leak_type', ['roof', 'terrace', 'wall', 'basement', 'other']).notNullable()
      table.enum('severity', ['minor', 'moderate', 'severe', 'emergency']).notNullable()
      table.text('description').nullable()
      table.json('photo_paths').nullable()
      table.string('calendly_event_id').nullable()
      table.timestamp('appointment_date').nullable()
      table.string('stripe_payment_intent_id').nullable()
      table.enum('payment_status', ['pending', 'paid', 'refunded', 'failed']).nullable()
      table.integer('amount_cents').nullable()
      table.enum('status', ['submitted', 'appointment_scheduled', 'paid', 'completed', 'cancelled']).defaultTo('submitted')
      table.integer('assigned_to').unsigned().nullable().references('id').inTable('users').onDelete('SET NULL')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
