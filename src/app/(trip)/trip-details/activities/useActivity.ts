import { useEffect, useState } from "react";
import { Alert } from "react-native";

import dayjs from "dayjs";
import { eq } from "drizzle-orm";

import { useDatabase } from "@/db/useDatabase";
import * as tripSchema from '@/db/schemas/schema'
import { formatHour } from "@/utils/dateTimeUtils";
import { ActivityModal, StepForm, TripActivitiesProps } from "../constants";

export function useActivity({ tripId }: { tripId: number }) {
    const { db } = useDatabase<typeof tripSchema>({ schema: tripSchema })

    const [showModal, setShowModal] = useState(ActivityModal.NONE)
    const [stepForm, setStepForm] = useState(StepForm.NEW_ACTIVITY)

    const [isCreatingActivity, setIsCreatingActivity] = useState(false)
    const [isLoadingActivities, setIsLoadingActivities] = useState(true)

    const [activity, setActivity] = useState({ id: '', title: '', hour: '', date: '' })
    const [tripActivities, setTripActivities] = useState<TripActivitiesProps[]>([])

    function resetNewActivityFields() {
        setActivity({ id: '', title: '', hour: '', date: '' })
        setShowModal(ActivityModal.NONE)
    }

    const handleHourChange = (text: string) => {
        const formattedHour = formatHour(text);
        setActivity(state => ({
            ...state,
            hour: formattedHour
        }))
    };

    const handleNewActivity = () => {
        setShowModal(ActivityModal.NEW_ACTIVITY)
        setStepForm(StepForm.NEW_ACTIVITY)
    }

    const handleUpdateActivityModal = (id: string) => {
        setShowModal(ActivityModal.UPDATE_ACTIVITY);
        setStepForm(StepForm.UPDATE_ACTIVITY)

        const filteredTripActivities = tripActivities.map((activity) => ({
            ...activity,
            data: activity.data.filter(item => item.id === id)
        })).filter(activity => activity.data.length > 0);

        if (filteredTripActivities[0].data) {
            const { id, title, hour, date } = filteredTripActivities[0].data[0];

            setActivity({ id, title: title ?? '', hour: hour ?? '', date: date ?? '' })
        }
    }

    async function getActivitiesByTripId({ id }: { id: number | undefined }) {
        if (!id) return [];

        const trip = await db.query.trip.findFirst({
            where: eq(tripSchema.trip.id, id),
            with: {
                activities: true
            },
        });

        if (!trip) {
            throw new Error('Trip not found.')
        }

        const differenceInDaysBetweenTripStartAndEnd = dayjs(trip.endsAt).diff(
            trip.startsAt,
            'days',
        )

        const activities = Array.from({
            length: differenceInDaysBetweenTripStartAndEnd + 1,
        }).map((_, daysToAdd) => {
            const dateToCompare = dayjs(trip.startsAt).add(daysToAdd, 'days').utc(); // Use UTC here

            return {
                date: dateToCompare.toDate(),
                activities: trip.activities.filter((activity) => {
                    return dayjs.utc(activity.occursAt).isSame(dateToCompare, 'day'); // Use UTC here too
                }),
            };
        });

        return activities;
    }

    async function getTripActivities() {
        try {
            const activities = await getActivitiesByTripId({ id: tripId })

            const activitiesToSectionList: any = activities.map((dayActivity) => ({
                title: {
                    dayNumber: dayjs(dayActivity.date).tz().date(),
                    dayName: dayjs(dayActivity.date).tz().format("dddd").replace("-feira", ""),
                },
                data: dayActivity.activities.map((activity) => ({
                    id: activity.id,
                    title: activity.title,
                    hour: dayjs(activity.occursAt).tz().format("hh[:]mm[h]"),
                    isBefore: dayjs(activity.occursAt).tz().isBefore(dayjs()),
                })),
            }));

            setTripActivities(activitiesToSectionList)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoadingActivities(false)
        }
    }

    async function handleCreateTripActivity() {
        try {
            const { title, date, hour } = activity
            if (!title || !date || !hour) {
                return Alert.alert("Cadastrar atividade", "Preencha todos os campos!")
            }

            setIsCreatingActivity(true)

            if (tripId) {
                const [hours, minutes] = hour.split(':').map(Number);

                const occursAt = dayjs(date).tz().hour(hours).minute(minutes).second(0).millisecond(0)

                await db.insert(tripSchema.activity).values({
                    tripId: tripId,
                    occursAt: dayjs(occursAt.toISOString()).toDate(),
                    title: title,
                })
            }

            Alert.alert("Nova Atividade", "Nova atividade cadastrada com sucesso!")

            await getTripActivities()
            resetNewActivityFields()
        } catch (error) {
            console.log(error)
        } finally {
            setIsCreatingActivity(false)
        }
    }

    async function handleUpdateActivity() {
        try {
            const { id, title, date, hour } = activity
            if (!title || !date || !hour) {
                return Alert.alert("Atualizar atividade", "Preencha todos os campos!")
            }

            setIsCreatingActivity(true)

            if (tripId) {
                const [hours, minutes] = hour.replace('h','').split(':').map(Number);

                const occursAt = dayjs(date).tz().hour(hours).minute(minutes).second(0).millisecond(0)

                await db.update(tripSchema.activity).set({
                    occursAt: dayjs(occursAt.toISOString()).toDate(),
                    title: title,
                }).where(eq(tripSchema.activity.id, parseInt(id)))
            }

            Alert.alert("Atualizar Atividade", "Atividade atualizada com sucesso!")

            await getTripActivities()
            resetNewActivityFields()
        } catch (error) {
            console.log(error)
        } finally {
            setIsCreatingActivity(false)
        }
    }

    async function handleRemoveActivity({ id }: { id: number }) {
        try {
            Alert.alert("Remover atividade", "Tem certeza que deseja remover a atividade", [
                {
                    text: "Não",
                    style: "cancel",
                },
                {
                    text: "Sim",
                    onPress: async () => {
                        await db
                            .delete(tripSchema.activity)
                            .where(eq(tripSchema.activity.id, id))

                        await getTripActivities()
                        resetNewActivityFields()
                    },
                },
            ])
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getTripActivities()
    }, [tripId])


    return {
        activity,
        stepForm,
        showModal,
        tripActivities,
        isCreatingActivity,
        isLoadingActivities,
        setActivity,
        setShowModal,
        handleHourChange,
        handleNewActivity,
        handleUpdateActivity,
        handleRemoveActivity,
        resetNewActivityFields,
        handleCreateTripActivity,
        handleUpdateActivityModal,
    }
}