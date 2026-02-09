import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import RealisationImage from './realisation_image.js'

export default class Realisation extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare slug: string

  @column()
  declare title: string

  @column()
  declare description: string

  @column()
  declare client: string | null

  @column()
  declare location: string

  @column()
  declare city: string

  @column()
  declare projectDate: string

  @column()
  declare duration: string | null

  @column()
  declare surface: string | null

  @column()
  declare pole: 'enveloppe' | 'amenagement'

  @column()
  declare services: string[]

  @column()
  declare featured: boolean

  @column()
  declare published: boolean

  @column()
  declare seoTitle: string | null

  @column()
  declare seoDescription: string | null

  @hasMany(() => RealisationImage)
  declare images: HasMany<typeof RealisationImage>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
