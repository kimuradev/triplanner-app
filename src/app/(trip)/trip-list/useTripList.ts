import { useEffect, useState } from "react";

import { desc, like } from "drizzle-orm"
import { useDatabase } from "@/db/useDatabase"
import * as tripSchema from '@/db/schemas/schema'
import { useIsFocused } from '@react-navigation/native';
import { getTotalActivityCompleted } from "@/utils/activityUtils";
import { ActivityProps } from "../trip-details/constants";

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
                orderBy: [desc(tripSchema.trip.createdAt)],
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

    function calculateProgress({ activities } :{ activities : ActivityProps[]}) {
        if (activities.length === 0) {
            return 0;
        }

        const progress = getTotalActivityCompleted(activities) / activities.length;

        return parseFloat(progress.toFixed(1));
    }

    return {
        data,
        searchDestination,
        calculateProgress,
        handleDestination
    }
}