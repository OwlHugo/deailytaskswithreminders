import {TypeOrmModuleOptions} from '@nestjs/typeorm'

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'daily_tasks',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true, 
  logging: true, 
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  extra: {
    max: 20,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
  },
  migrations: [],
  migrationsRun: false,
}