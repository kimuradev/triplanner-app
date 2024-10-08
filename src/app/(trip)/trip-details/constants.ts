export enum StepForm {
    NEW_ACTIVITY = 1,
    UPDATE_ACTIVITY = 2,
}

export type ActivityProps = {
    id: string
    title: string
    hour: string
    isBefore: boolean
    date?: string
}

export enum ActivityModal {
    NONE = 0,
    CALENDAR = 1,
    NEW_ACTIVITY = 2,
    UPDATE_ACTIVITY = 3,
}

export type TripActivitiesProps = {
    title: {
        dayNumber: number
        dayName: string
    }
    data: ActivityProps[]
}

export enum TripDetailsModal {
    NONE = 0,
    UPDATE_TRIP = 1,
    CALENDAR = 2,
}