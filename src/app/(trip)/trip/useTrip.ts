import { useState } from "react"
import { Alert } from "react-native"
import { router } from "expo-router"
import { DateData } from "react-native-calendars"

import { StepForm } from "@/utils/constants"
import { calendarUtils, DatesSelected } from "@/utils/calendarUtils"

export function useTrip() {
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
                "Detalhes da viagem",
                "O destino deve ter pelo menos 4 caracteres."
            )
        }

        if (
            destination.trim().length === 0 ||
            !selectedDates.startsAt ||
            !selectedDates.endsAt
        ) {
            return Alert.alert(
                "Detalhes da viagem",
                "Preencha todos as informações da viagem para seguir."
            )
        }

        setStepForm(StepForm.TRIP_CONFIRMATION)

        if (stepForm === StepForm.TRIP_CONFIRMATION) {
            router.navigate('/trip-list')
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