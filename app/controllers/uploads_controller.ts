import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import fs from 'node:fs/promises'

export default class UploadsController {
  /**
   * POST /api/v1/uploads — Public: upload a file (photos)
   */
  async store({ request, response }: HttpContext) {
    const file = request.file('file', {
      size: '5mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp', 'avif'],
    })

    if (!file) {
      return response.badRequest({ error: 'No file provided' })
    }

    if (!file.isValid) {
      return response.badRequest({ errors: file.errors })
    }

    const fileName = `${Date.now()}-${file.clientName}`
    await file.move(app.makePath('storage/uploads'), { name: fileName })

    return response.created({
      url: `/uploads/${fileName}`,
      fileName,
    })
  }

  /**
   * GET /uploads/:filename — Public: serve an uploaded file
   */
  async show({ params, response }: HttpContext) {
    if (params.filename.includes('..') || params.filename.includes('/')) {
      return response.badRequest({ error: 'Invalid filename' })
    }

    const filePath = app.makePath('storage/uploads', params.filename)

    try {
      await fs.access(filePath)
    } catch {
      return response.notFound({ error: 'File not found' })
    }

    return response.download(filePath)
  }
}
