export type TripDataProps = {
    id?: number;
    destination: string;
    scheduleDate: string;
    startsAt?: Date;
    endsAt?: Date;
    isConfirmed?: boolean;
    activities?: {
        id: number;
        title: string;
        occursAt: Date;
        tripId: number;
    }[];
    createdAt?: Date;
}