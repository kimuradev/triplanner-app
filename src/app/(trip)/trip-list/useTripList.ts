import { data } from "@/utils/data";
import { useState } from "react";

export function useTripList() {

    const [searchDestination, setSearchDestination] = useState('');

    const handleDestination = (text: string) => {
        setSearchDestination(text);
    };

    const filteredTrips = data.filter((item) =>
        item.destination.toLowerCase().includes(searchDestination.toLowerCase())
    );

    function calculateProgress(activities: { completed: number, total: number}) {
        const { completed, total } = activities;
        
        if (total === 0) {
            return 0;
        }
    
        const progress = completed / total;
    
        return parseFloat(progress.toFixed(1));
    }

    return {
        filteredTrips,
        searchDestination,
        calculateProgress,
        handleDestination
    }
}