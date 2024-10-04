import { createContext, useContext, useState } from "react";

import { type TripDataProps } from "@/app/(trip)/definition";

type TripContextProps = {
     trip: TripDataProps ; 
     setTrip: React.Dispatch<React.SetStateAction<TripDataProps>>; 
}

const TripContext = createContext<TripContextProps | null>(null)

export const TripContextProvider = ({ children }: { children: React.ReactNode}) => {
    const [trip, setTrip] = useState<TripDataProps>({
        destination: '', 
        scheduleDate: ''
    })

    return (
        <TripContext.Provider value={{ trip , setTrip }}>
            {children}
        </TripContext.Provider>
    )
}

export function useTripContext() {
    const context = useContext(TripContext);

    if (!context) throw new Error('You must use TripContext Provider')

    return context;
}