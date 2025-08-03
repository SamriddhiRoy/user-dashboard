import { pgTable, text, uuid, timestamp, boolean, jsonb, integer, varchar, serial } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name'),
  avatarUrl: text('avatar_url'),
  role: text('role').notNull().default('normal'), // 'normal' or 'superuser'
  googleId: text('google_id'),
  hashedPassword: text('hashed_password'),
  emailVerified: boolean('email_verified').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const todos = pgTable('todos', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  scheduledAt: timestamp('scheduled_at').notNull(),
  completed: boolean('completed').default(false),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

export const properties = pgTable('properties', {
  id: serial('id').primaryKey(),
  zpid: varchar('zpid', { length: 50 }).unique().notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  propdetails: text('propdetails'),
  price: integer('price').notNull(),
  location: varchar('location', { length: 255 }).notNull(),
  imageUrl: varchar('image_url', { length: 500 }).notNull(),
  bedrooms: integer('bedrooms').notNull(),
  bathrooms: integer('bathrooms').notNull(),
  sqft: integer('sqft').notNull(),
  LotSize: integer('lot_size'),
  HOADues: integer('hoa_dues'),
  YearBuilt: integer('year_built'),
  GarageSqFt: integer('garage_sqft'),
  BasementSqFt: integer('basement_sqft'),
  propertyType: varchar('property_type', { length: 100 }).notNull(),
  isForSale: boolean('is_for_sale').notNull().default(true),
  basement: text('basement'),
  floorCovering: text('floor_covering'),
  coolingType: text('cooling_type'),
  heatingType: text('heating_type'),
  heatingFuel: text('heating_fuel'),
  rooms: text('rooms'),
  indoorFeatures: text('indoor_features'),
  buildingAmenities: text('building_amenities'),
  architecturalStyle: text('architectural_style'),
  exterior: text('exterior'),
  outdoorAmenities: text('outdoor_amenities'),
  parking: text('parking'),
  roof: text('roof'),
  view: text('view'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})