import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'leak_detections'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.uuid('folder_id').nullable().unique().index()
      table.string('stripe_checkout_session_id').nullable()
      table.string('city', 100).nullable().alter()
      table.string('postal_code', 5).nullable().alter()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('folder_id')
      table.dropColumn('stripe_checkout_session_id')
      table.string('city', 100).notNullable().alter()
      table.string('postal_code', 5).notNullable().alter()
    })
  }
}
