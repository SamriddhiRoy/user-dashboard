import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'

const migrationClient = postgres(process.env.DATABASE_URL!, { max: 1 })

const main = async () => {
  console.log('Running migrations...')
  await migrate(drizzle(migrationClient), { migrationsFolder: './server/migrations' })
  console.log('Migrations complete!')
  process.exit(0)
}

main().catch((error) => {
  console.error('Migration failed:', error)
  process.exit(1)
})