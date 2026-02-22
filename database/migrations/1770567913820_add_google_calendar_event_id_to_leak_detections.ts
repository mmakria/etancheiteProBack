import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'leak_detections'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('google_calendar_event_id').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('google_calendar_event_id')
    })
  }
}
