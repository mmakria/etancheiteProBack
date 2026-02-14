import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'leak_detections'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('calendly_event_id')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('calendly_event_id').nullable()
    })
  }
}
