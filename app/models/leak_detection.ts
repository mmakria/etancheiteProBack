import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'

export default class LeakDetection extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare firstName: string

  @column()
  declare lastName: string

  @column()
  declare email: string

  @column()
  declare phone: string

  @column()
  declare address: string

  @column()
  declare city: string | null

  @column()
  declare postalCode: string | null

  @column()
  declare folderId: string | null

  @column()
  declare stripeCheckoutSessionId: string | null

  @column()
  declare leakType: 'roof' | 'terrace' | 'wall' | 'basement' | 'other'

  @column()
  declare severity: 'minor' | 'moderate' | 'severe' | 'emergency'

  @column()
  declare description: string | null

  @column()
  declare photoPaths: string[] | null

  @column.dateTime()
  declare appointmentDate: DateTime | null

  @column()
  declare stripePaymentIntentId: string | null

  @column()
  declare paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed' | null

  @column()
  declare amountCents: number | null

  @column()
  declare status: 'submitted' | 'appointment_scheduled' | 'paid' | 'completed' | 'cancelled'

  @column()
  declare googleCalendarEventId: string | null

  @column()
  declare assignedTo: number | null

  @belongsTo(() => User, { foreignKey: 'assignedTo' })
  declare assignee: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
