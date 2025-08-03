import { pgTable, text, uuid, timestamp, boolean, jsonb, integer, serial } from 'drizzle-orm/pg-core'

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
  zpid: text('zpid'),
  title: text('title'),
  location: text('location'),
  price: integer('price'),
  description: text('description'),
  propdetails: text('propdetails'),
  imageUrl: text('image_url'),
  bedrooms: integer('bedrooms'),
  bathrooms: integer('bathrooms'),
  sqft: integer('sqft'),
  LotSize: integer('lot_size'),
  HOADues: integer('hoa_dues'),
  YearBuilt: integer('year_built'),
  GarageSqFt: integer('garage_sqft'),
  BasementSqFt: integer('basement_sqft'),
  propertyType: text('property_type'),
  isForSale: boolean('is_for_sale'),
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
  images: jsonb('images'),
  details: jsonb('details'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const propertyImages = pgTable('property_images', {
  id: uuid('id').primaryKey().defaultRandom(),
  propertyId: integer('property_id').references(() => properties.id, { onDelete: 'cascade' }),
  fileName: text('file_name'),
  fileUrl: text('file_url'),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})