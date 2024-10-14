import dayjs from "dayjs";
import { asc, like } from "drizzle-orm"

import * as tripSchema from '@/db/schemas/schema'
import { formatTimestampToDate } from "@/utils/dateTimeUtils"
import { calendarUtils, DatesSelected } from "@/utils/calendarUtils";

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

export const getTripByDestination = async ({ db, searchDestination }: { db: any, searchDestination: string }) => {
    return await db.query.trip.findMany({
        with: {
            activities: true
        },
        where: like(tripSchema.trip.destination, `%${searchDestination}%`),
        orderBy: [asc(tripSchema.trip.startsAt)],
    })
}