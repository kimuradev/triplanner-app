import { useEffect, useState } from "react";

import { asc, like } from "drizzle-orm"
import { useDatabase } from "@/db/useDatabase"
import * as tripSchema from '@/db/schemas/schema'
import { useIsFocused } from '@react-navigation/native';

export function useTripList() {
    const { db } = useDatabase<typeof tripSchema>({ schema: tripSchema })

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

            setData(response)
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