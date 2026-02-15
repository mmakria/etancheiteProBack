import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class extends BaseSeeder {
  async run() {
    const email = process.env.ADMIN_EMAIL
    const password = process.env.ADMIN_PASSWORD

    if (!email || !password) {
      console.log('Skipping admin seeder: ADMIN_EMAIL and ADMIN_PASSWORD env vars required')
      console.log('Usage: ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=secret node ace db:seed')
      return
    }

    await User.updateOrCreate(
      { email },
      {
        fullName: 'Makria Admin',
        email,
        password,
      }
    )

    console.log(`Admin user created/updated: ${email}`)
  }
}
