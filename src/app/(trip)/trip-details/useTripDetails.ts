import { useEffect, useState } from 'react';
import { Alert} from 'react-native';
import dayjs from 'dayjs';
import { eq } from 'drizzle-orm';
import { router } from 'expo-router';
import { DateData } from 'react-native-calendars';

import { useDatabase } from "@/db/useDatabase"
import * as tripSchema from '@/db/schemas/schema'
import { formatTimestampToDate } from '@/utils/dateTimeUtils';
import { calendarUtils, DatesSelected } from '@/utils/calendarUtils';

import { TripDataProps } from '../definition';
import { TripDetailsModal } from './constants';

export function useTripDetails({ tripId }: { tripId: string }) {
    const [data, setData] = useState<TripDataProps>({
        destination: '',
        scheduleDate: ''
    })
    const { db } = useDatabase<typeof tripSchema>({ schema: tripSchema })
    const [isUpdatingTrip, setIsUpdatingTrip] = useState(false)
    const [showModal, setShowModal] = useState(TripDetailsModal.NONE)

    const [destination, setDestination] = useState("")
    const [selectedDates, setSelectedDates] = useState({} as DatesSelected)

    async function getTripById({ id }: { id: string }) {
        try {
            const response = await db.query.trip.findFirst({
                with: {
                    activities: true
                },
                where: eq(tripSchema.trip.id, parseInt(id))
            })

            if (response) {
                setData(response)
                setDestination(response.destination)
            }

        } catch (error) {
            console.error(error)
        }
    }

    async function handleUpdateTrip({ id }: { id: number }) {
        try {
            if (!tripId) {
                return
            }

            if (!destination || !selectedDates.startsAt || !selectedDates.endsAt) {
                return Alert.alert(
                    "Atualizar viagem",
                    "Lembre-se de, além de preencher o destino, selecione data de início e fim da viagem."
                )
            }

            setIsUpdatingTrip(true)

            await db
                .update(tripSchema.trip)
                .set({
                    destination: destination,
                    startsAt: formatTimestampToDate(selectedDates.startsAt?.timestamp),
                    endsAt: formatTimestampToDate(selectedDates.endsAt.timestamp),
                    scheduleDate: calendarUtils.formatDatesInText({
                        startsAt: dayjs(formatTimestampToDate(selectedDates.startsAt?.timestamp)).tz(),
                        endsAt: dayjs(formatTimestampToDate(selectedDates.endsAt.timestamp)).tz()
                    })
                })
                .where(eq(tripSchema.trip.id, parseInt(tripId)));

            Alert.alert("Atualizar viagem", "Viagem atualizada com sucesso!", [
                {
                    text: "OK",
                    onPress: () => {
                        setShowModal(TripDetailsModal.NONE)
                        getTripById({ id: tripId })
                    },
                },
            ])
        } catch (error) {
            console.log(error)
        } finally {
            setIsUpdatingTrip(false)
        }
    }

    async function handleRemoveTrip({ id }: { id: number }) {
        try {
            Alert.alert("Remover viagem", "Tem certeza que deseja remover a viagem", [
                {
                    text: "Não",
                    style: "cancel",
                },
                {
                    text: "Sim",
                    onPress: async () => {
                        await db
                            .delete(tripSchema.trip)
                            .where(eq(tripSchema.trip.id, id))

                        router.navigate('/')
                    },
                },
            ])
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getTripById({ id: tripId })
    }, [tripId])

    function handleSelectDate(selectedDay: DateData) {
        const dates = calendarUtils.orderStartsAtAndEndsAt({
            startsAt: selectedDates.startsAt,
            endsAt: selectedDates.endsAt,
            selectedDay,
        })

        setSelectedDates(dates)
    }

    return {
        data,
        showModal,
        destination,
        selectedDates,
        isUpdatingTrip,
        setShowModal,
        setDestination,
        handleUpdateTrip,
        handleRemoveTrip,
        handleSelectDate,
    }
}