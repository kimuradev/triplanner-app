import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

import { relations, sql } from "drizzle-orm";

// Trip Table
export const trip = sqliteTable("trips", {
    id: integer("id").primaryKey(),
    destination: text("destination").notNull(),
    startsAt: integer('starts_at', { mode: 'timestamp' }).notNull(),
    endsAt: integer('ends_at', { mode: 'timestamp' }).notNull(),
    scheduleDate: text("scheduleDate").notNull(),
    isConfirmed: integer('isConfirmed', { mode: 'boolean' }).notNull().default(false),
    createdAt: integer('createdAt', { mode: 'timestamp' }).notNull().default(sql`(current_timestamp)`),
});

// Define relations between the tables
export const tripRelations = relations(trip, ({ many }) => ({
    activities: many(activity),
}));


// Activity Table
export const activity = sqliteTable("activities", {
    id: integer("id").primaryKey(),
    title: text("title").notNull(),
    obs: text("obs").default(''),
    occursAt: integer('occurs_at', { mode: 'timestamp' }).notNull(),
    isDone: integer('isDone', { mode: 'boolean' }).notNull().default(false),
    tripId: integer("trip_id").notNull(), // Foreign key to `trip`
});

export const activityRelations = relations(activity, ({ one }) => ({
    trip: one(trip, {
        fields: [activity.tripId], // Define the foreign key relationship
        references: [trip.id],     // Reference the `trip` table's `id`
    }),
}));

