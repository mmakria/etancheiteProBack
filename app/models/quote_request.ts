import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class QuoteRequest extends BaseModel {
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
  declare company: string | null

  @column()
  declare serviceType: string

  @column()
  declare pole: 'enveloppe' | 'amenagement'

  @column()
  declare projectDescription: string

  @column()
  declare projectAddress: string | null

  @column()
  declare projectCity: string | null

  @column()
  declare projectPostalCode: string | null

  @column()
  declare preferredContactMethod: 'phone' | 'email' | 'both'

  @column()
  declare budget: string | null

  @column()
  declare urgency: 'low' | 'medium' | 'high' | 'urgent'

  @column()
  declare status: 'pending' | 'contacted' | 'quoted' | 'accepted' | 'rejected'

  @column()
  declare photoPaths: string[] | null

  @column()
  declare internalNotes: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
