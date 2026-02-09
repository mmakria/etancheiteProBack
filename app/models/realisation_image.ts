import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Realisation from './realisation.js'

export default class RealisationImage extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare realisationId: number

  @column()
  declare url: string

  @column()
  declare alt: string

  @column()
  declare caption: string | null

  @column()
  declare isPrimary: boolean

  @column()
  declare sortOrder: number

  @belongsTo(() => Realisation)
  declare realisation: BelongsTo<typeof Realisation>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
