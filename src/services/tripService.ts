import dayjs from "dayjs";
import { asc, like, eq } from "drizzle-orm"

import * as tripSchema from '@/db/schemas/schema'
import { formatTimestampToDate } from "@/utils/dateTimeUtils"
import { calendarUtils, DatesSelected } from "@/utils/calendarUtils";

export const getTripByDestination = async ({ db, searchDestination }: { db: any, searchDestination: string }) => {
    return await db.query.trip.findMany({
        with: {
            activities: true
        },
        where: like(tripSchema.trip.destination, `%${searchDestination}%`),
        orderBy: [asc(tripSchema.trip.startsAt)],
    })
}

export const getTripWithActivitiesById = async ({ db, id }: { db: any, id: string }) => {
    return await db.query.trip.findFirst({
        with: {
            activities: true,
        },
        where: eq(tripSchema.trip.id, parseInt(id))
    })
}

export const createTrip = async ({ db, destination, selectedDates }: { db: any, destination: string, selectedDates: DatesSelected }) => {
    return await db.insert(tripSchema.trip).values({
        destination,
        startsAt: formatTimestampToDate(selectedDates.startsAt?.timestamp),
        endsAt: formatTimestampToDate(selectedDates.endsAt?.timestamp),
        scheduleDate: calendarUtils.formatDatesInText({
            startsAt: dayjs(formatTimestampToDate(selectedDates.startsAt?.timestamp)).tz(),
            endsAt: dayjs(formatTimestampToDate(selectedDates.endsAt?.timestamp)).tz()
        })
    })
};

export const updateTripById = async ({ db, tripId, destination, selectedDates }: { db: any, tripId: string, destination: string, selectedDates: DatesSelected }) => {
    return await db
        .update(tripSchema.trip)
        .set({
            destination,
            startsAt: formatTimestampToDate(selectedDates.startsAt?.timestamp),
            endsAt: formatTimestampToDate(selectedDates.endsAt?.timestamp),
            scheduleDate: calendarUtils.formatDatesInText({
                startsAt: dayjs(formatTimestampToDate(selectedDates.startsAt?.timestamp)).tz(),
                endsAt: dayjs(formatTimestampToDate(selectedDates.endsAt?.timestamp)).tz()
            })
        })
        .where(eq(tripSchema.trip.id, parseInt(tripId)));
}

export const deleteTripById = async ({ db, id }: { db: any, id: number }) => {
    return await db
        .delete(tripSchema.trip)
        .where(eq(tripSchema.trip.id, id))
}