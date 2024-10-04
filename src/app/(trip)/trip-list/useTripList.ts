import { useEffect, useState } from "react";
import dayjs from "dayjs";

import { asc, eq, like } from "drizzle-orm"
import { useSQLiteContext } from "expo-sqlite"
import { drizzle } from "drizzle-orm/expo-sqlite"
import * as tripSchema from '@/db/schemas/schema'
import { useIsFocused } from '@react-navigation/native';
import { calendarUtils } from "@/utils/calendarUtils";

export function useTripList() {
    const database = useSQLiteContext()
    const db = drizzle(database, { schema: tripSchema })

    const [data, setData] = useState<any>([])
    const [searchDestination, setSearchDestination] = useState('');

    const isFocused = useIsFocused();

    async function fetchTrips() {
        try {
            const response = await db.query.trip.findMany({
                with: {
                    activities: true
                },
                where: like(tripSchema.trip.destination, `%${searchDestination}%`),
                orderBy: [asc(tripSchema.trip.createdAt)],
            })

            const updatedResponse = response.map(item => ({
                ...item,
                scheduleDate: calendarUtils.formatDatesInText({
                    startsAt: dayjs(item.startsAt),
                    endsAt: dayjs(item.endsAt)
                })
            }))

            setData(updatedResponse)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchTrips()
    }, [isFocused, searchDestination])

    const handleDestination = (text: string) => {
        setSearchDestination(text);
    };

    function calculateProgress(activities: { completed: number, total: number }) {
        const { completed = 0, total = 0 } = activities;

        if (total === 0) {
            return 0;
        }

        const progress = completed / total;

        return parseFloat(progress.toFixed(1));
    }

    return {
        data,
        searchDestination,
        calculateProgress,
        handleDestination
    }
}