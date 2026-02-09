import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class CityPage extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare slug: string

  @column()
  declare name: string

  @column()
  declare department: string

  @column()
  declare departmentCode: string

  @column()
  declare postalCodes: string[] | null

  @column()
  declare seoTitle: string | null

  @column()
  declare seoDescription: string | null

  @column()
  declare introContent: string | null

  @column()
  declare mainContent: string | null

  @column()
  declare keywords: string[] | null

  @column()
  declare nearbyServices: string[] | null

  @column()
  declare neighborCities: { slug: string; name: string; departmentCode: string }[] | null

  @column()
  declare published: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
