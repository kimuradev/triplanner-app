import { eq, or, lt, gt, and } from "drizzle-orm"

import * as tripSchema from '@/db/schemas/schema'
import { DatesSelected } from "@/utils/calendarUtils";
import { formatTimestampToDate } from "@/utils/dateTimeUtils";
import dayjs from "dayjs";

export const getActivitiesById = async ({ db, id }: { db: any, id: number }) => {
    return await db.query.trip.findFirst({
        where: eq(tripSchema.trip.id, id),
        with: {
            activities: true
        },
    });
}

export const getActivitiesOutsideOfDateRange = async ({ db, tripId, selectedDates }: { db: any, tripId: string, selectedDates: DatesSelected }) => {
    return await db.query.activity.findMany({
        where: (activity: any) =>
            and(
                eq(activity.tripId, parseInt(tripId)),
                or(
                    lt(activity.occursAt, formatTimestampToDate(selectedDates.startsAt?.timestamp)),
                    gt(activity.occursAt, formatTimestampToDate(selectedDates.endsAt?.timestamp))
                )
            )
    });
}

export const createActivity = async ({ db, tripId, occursAt, title, obs }: { db: any, tripId: number, occursAt: dayjs.Dayjs, title: string, obs: string }) => {
    return await db.insert(tripSchema.activity).values({
        tripId,
        occursAt: dayjs(occursAt.toISOString()).toDate(),
        title,
        obs
    })
}

export const updateActivityById = async ({ db, id, occursAt, title, obs }: { db: any, id: number, occursAt: dayjs.Dayjs, title: string, obs: string }) => {
    return await db.update(tripSchema.activity).set({
        occursAt: dayjs(occursAt.toISOString()).toDate(),
        title,
        obs
    }).where(eq(tripSchema.activity.id, id))
}

export const updateActivityDone = async ({ db, id }: { db: any, id: number }) => {
    return db.update(tripSchema.activity).set({
        isDone: true,
    }).where(eq(tripSchema.activity.id, id))
}

export const deleteActivitiesById = async ({ db, id }: { db: any, id: number }) => {
    return await db.delete(tripSchema.activity).where(eq(tripSchema.activity.id, id))
}