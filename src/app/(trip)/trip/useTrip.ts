import { useState } from "react"
import { Alert } from "react-native"
import { router } from "expo-router"
import { useTranslation } from "react-i18next"
import { DateData } from "react-native-calendars"

import { StepForm } from "./constants"
import { calendarUtils, DatesSelected } from "@/utils/calendarUtils"

import { useDatabase } from "@/db/useDatabase"
import * as tripSchema from '@/db/schemas/schema'
import { createTrip } from "@/services/tripService"

export function useTrip() {
    const { db } = useDatabase({ schema: tripSchema })
    const { t } = useTranslation();

    const [isCreatingTrip, setIsCreatingTrip] = useState(false)
    const [stepForm, setStepForm] = useState(StepForm.TRIP_DETAILS)
    const [selectedDates, setSelectedDates] = useState({} as DatesSelected)
    const [destination, setDestination] = useState("")

    const handleDestination = (value: string) => {
        setDestination(value)
    }

    const handleNextStepForm = () => {
        if (destination.length < 4) {
            return Alert.alert(
                t('trip.header'),
                t('home.minCharsMessage')
            )
        }

        if (
            destination.trim().length === 0 ||
            !selectedDates.startsAt ||
            !selectedDates.endsAt
        ) {
            return Alert.alert(
                t('trip.header'),
                t('home.fillAllRequiredMessage')
            )
        }

        setStepForm(StepForm.TRIP_CONFIRMATION)

        if (stepForm === StepForm.TRIP_CONFIRMATION) {
            handleAddTrip()
        }
    }

    const handleSelectDate = (selectedDay: DateData) => {
        const dates = calendarUtils.orderStartsAtAndEndsAt({
            startsAt: selectedDates.startsAt,
            endsAt: selectedDates.endsAt,
            selectedDay,
        })

        setSelectedDates(dates)
    }

    const handleAddTrip = async () => {
        setIsCreatingTrip(true)

        try {
            await createTrip({ db, destination, selectedDates });

            Alert.alert(t('home.destinationSuccessMessage'))

            setDestination('')
            setSelectedDates({} as DatesSelected)
            setStepForm(StepForm.TRIP_DETAILS)

            router.navigate('/trip-list')

        } catch (error) {
            console.log(error)
        } finally {
            setIsCreatingTrip(false)
        }
    }

    return {
        destination,
        isCreatingTrip,
        selectedDates,
        stepForm,
        setStepForm,
        handleDestination,
        handleNextStepForm,
        handleSelectDate
    }
}