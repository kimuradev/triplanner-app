import { useState } from "react"
import { Alert } from "react-native"
import { router } from "expo-router"
import { DateData } from "react-native-calendars"

import { StepForm } from "@/utils/constants"
import { calendarUtils, DatesSelected } from "@/utils/calendarUtils"

import * as tripSchema from '@/db/schemas/schema'
import { useDatabase } from "@/db/useDatabase"

export function useTrip() {
    const { db } = useDatabase({ schema: tripSchema})

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

    const formatTimestampToDate = (timestamp: number | undefined) => {

        if (!timestamp) return new Date();

        const date = new Date(timestamp);

        // Convert to ISO format (with Z)
        // return date.toISOString();
        return date
    }

    const handleAddTrip = async () => {
        setIsCreatingTrip(true)

        try {
            await db.insert(tripSchema.trip).values({
                destination,
                endsAt: formatTimestampToDate(selectedDates.endsAt?.timestamp), 
                startsAt: formatTimestampToDate(selectedDates.startsAt?.timestamp),
            })

            Alert.alert("Destino adicionado com sucesso.")

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