import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { DateData } from 'react-native-calendars';

import { useDatabase } from "@/db/useDatabase"
import * as tripSchema from '@/db/schemas/schema'
import { calendarUtils, DatesSelected } from '@/utils/calendarUtils';

import { TripDetailsModal, TripDataProps } from './constants';
import { deleteTripById, getTripWithActivitiesById, updateTripById } from '@/services/tripService';
import { deleteActivitiesById, getActivitiesOutsideOfDateRange } from '@/services/activityService';

export function useTripDetails({ tripId }: { tripId: string }) {
    const { t } = useTranslation()
    const [data, setData] = useState<TripDataProps>({
        destination: '',
        scheduleDate: '',
        activities: []
    })
    const { db } = useDatabase<typeof tripSchema>({ schema: tripSchema })
    const [isUpdatingTrip, setIsUpdatingTrip] = useState(false)
    const [showModal, setShowModal] = useState(TripDetailsModal.NONE)

    const [destination, setDestination] = useState("")
    const [selectedDates, setSelectedDates] = useState({} as DatesSelected)

    async function getTripById({ id }: { id: string }) {
        try {
            const response = await getTripWithActivitiesById({ db, id })

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
                    t('trip.details.updateTrip'),
                    t('trip.details.updateTripMessage')
                )
            }

            setIsUpdatingTrip(true)

            const activities = await getActivitiesOutsideOfDateRange({ db, tripId, selectedDates })

            if (activities.length) {
                for (const activity of activities) {
                    await deleteActivitiesById({ db, id: activity.id })
                }
            }

            await updateTripById({ db, tripId, destination, selectedDates })

            Alert.alert(t('trip.details.updateTrip'), t('trip.details.updateTripSuccessMessage'), [
                {
                    text: t('trip.ok'),
                    onPress: async () => {
                        setShowModal(TripDetailsModal.NONE)
                        await getTripById({ id: tripId })
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
            Alert.alert(t('trip.details.removeTrip'), t('trip.details.removeTripMessage'), [
                {
                    text: t('trip.no'),
                    style: "cancel",
                },
                {
                    text: t('trip.yes'),
                    onPress: async () => {
                        await deleteTripById({ db, id })

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