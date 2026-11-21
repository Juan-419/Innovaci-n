import { relations } from 'drizzle-orm';
import {
  boolean,
  doublePrecision,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  displayName: text('display_name'),
  themePreference: text('theme_preference').default('calido').notNull(),
  seededSampleData: boolean('seeded_sample_data').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const cows = pgTable('cows', {
  id: serial('id').primaryKey(),
  clientId: text('client_id').notNull().unique(),
  userUid: text('user_uid')
    .references(() => users.uid, { onDelete: 'cascade' })
    .notNull(),
  name: text('name').notNull(),
  tagNumber: text('tag_number').notNull(),
  lot: text('lot').notNull(),
  breed: text('breed').notNull(),
  paddock: text('paddock').notNull(),
  imageUrl: text('image_url').notNull(),
  defaultLiters: doublePrecision('default_liters').default(16).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const milkingRecords = pgTable('milking_records', {
  id: serial('id').primaryKey(),
  clientId: text('client_id').notNull().unique(),
  userUid: text('user_uid')
    .references(() => users.uid, { onDelete: 'cascade' })
    .notNull(),
  receiptCode: text('receipt_code').notNull(),
  cowId: text('cow_id').notNull(),
  cowName: text('cow_name').notNull(),
  cowTag: text('cow_tag').notNull(),
  lot: text('lot').notNull(),
  breed: text('breed').notNull(),
  imageUrl: text('image_url').notNull(),
  liters: doublePrecision('liters').notNull(),
  shift: text('shift').notNull(),
  shiftTime: text('shift_time').notNull(),
  quality: text('quality').notNull(),
  qualityNote: text('quality_note'),
  timeFormatted: text('time_formatted').notNull(),
  dateFormatted: text('date_formatted').notNull(),
  operator: text('operator').notNull(),
  recordedAt: timestamp('recorded_at').defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  cows: many(cows),
  milkingRecords: many(milkingRecords),
}));

export const cowsRelations = relations(cows, ({ one }) => ({
  user: one(users, {
    fields: [cows.userUid],
    references: [users.uid],
  }),
}));

export const milkingRecordsRelations = relations(milkingRecords, ({ one }) => ({
  user: one(users, {
    fields: [milkingRecords.userUid],
    references: [users.uid],
  }),
}));
