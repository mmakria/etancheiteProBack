import type { HttpContext } from '@adonisjs/core/http'
import LeakDetection from '#models/leak_detection'
import { createLeakDetectionValidator, updateLeakDetectionValidator } from '#validators/leak_detection_validator'

export default class LeakDetectionsController {
  /**
   * POST /api/v1/leak-detections — Public: create a leak detection request
   */
  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(createLeakDetectionValidator)
    const detection = await LeakDetection.create(data)
    return response.created(detection)
  }

  /**
   * GET /api/v1/admin/leak-detections — Admin: list all
   */
  async index({ request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 20)
    const status = request.input('status')

    const query = LeakDetection.query().orderBy('created_at', 'desc')

    if (status) {
      query.where('status', status)
    }

    return query.paginate(page, limit)
  }

  /**
   * GET /api/v1/admin/leak-detections/:id — Admin: show one
   */
  async show({ params }: HttpContext) {
    return LeakDetection.findOrFail(params.id)
  }

  /**
   * PUT /api/v1/admin/leak-detections/:id — Admin: update
   */
  async update({ params, request }: HttpContext) {
    const detection = await LeakDetection.findOrFail(params.id)
    const data = await request.validateUsing(updateLeakDetectionValidator)
    detection.merge(data)
    await detection.save()
    return detection
  }

  /**
   * DELETE /api/v1/admin/leak-detections/:id — Admin: delete
   */
  async destroy({ params, response }: HttpContext) {
    const detection = await LeakDetection.findOrFail(params.id)
    await detection.delete()
    return response.noContent()
  }
}
