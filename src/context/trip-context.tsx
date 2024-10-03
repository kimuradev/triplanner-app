import { createContext, useContext, useState } from "react";

type TripContextProps = {
     data: {}; 
     setData: React.Dispatch<React.SetStateAction<{}>>; 
}

const TripContext = createContext<TripContextProps | null>(null)

export const TripContextProvider = ({ children }: { children: React.ReactNode}) => {
    const [data, setData] = useState({});

    return (
        <TripContext.Provider value={{ data , setData }}>
            {children}
        </TripContext.Provider>
    )
}

export function useTripContext() {
    const context = useContext(TripContext);

    if (!context) throw new Error('You must use TripContext Provider')

    return context;
}