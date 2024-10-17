import { useEffect, useState } from "react";
import { Alert } from "react-native";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

import { TIME_ZONE } from "@/utils/constants";
import { useDatabase } from "@/db/useDatabase";
import * as tripSchema from '@/db/schemas/schema'
import { formatHour } from "@/utils/dateTimeUtils";
import { ActivityModal, ActivityProps, StepForm, TripActivitiesProps, TripDataProps } from "../constants";
import { createActivity, deleteActivitiesById, getActivitiesById, updateActivityById, updateActivityDone } from "@/services/activityService";

export function useActivity({ tripDetails }: { tripDetails: TripDataProps }) {
    const { t } = useTranslation()
    const { db } = useDatabase<typeof tripSchema>({ schema: tripSchema })

    const [showModal, setShowModal] = useState(ActivityModal.NONE)
    const [stepForm, setStepForm] = useState(StepForm.NEW_ACTIVITY)

    const [isCreatingActivity, setIsCreatingActivity] = useState(false)

    const [activity, setActivity] = useState({ id: '', title: '', hour: '', date: '', obs: '' })
    const [tripActivities, setTripActivities] = useState<TripActivitiesProps[]>([])

    function resetNewActivityFields() {
        setActivity({ id: '', title: '', hour: '', date: '', obs: '' })
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

    const handleUpdateActivityModal = ({ id }: { id: string }) => {
        setShowModal(ActivityModal.UPDATE_ACTIVITY);
        setStepForm(StepForm.UPDATE_ACTIVITY)

        const filteredTripActivities = tripActivities.map((activity) => ({
            ...activity,
            data: activity.data.filter(item => item.id === id)
        })).filter(activity => activity.data.length > 0);

        if (filteredTripActivities[0].data) {
            const { id, title, hour, date, obs } = filteredTripActivities[0].data[0];

            setActivity({ id, title: title ?? '', hour: hour ?? '', date: date ?? '', obs: obs ?? '' })
        }
    }

    async function getActivitiesByTripId({ id }: { id: number | undefined }) {
        if (!id) return [];

        const trip = await getActivitiesById({ db, id })

        if (!trip) {
            throw new Error(t('trip.tripNotFound'))
        }

        const differenceInDaysBetweenTripStartAndEnd = dayjs(trip.endsAt).diff(
            trip.startsAt,
            'days',
        )

        const activities = Array.from({
            length: differenceInDaysBetweenTripStartAndEnd + 1,
        }).map((_, daysToAdd) => {
            const dateToCompare = dayjs(trip.startsAt).add(daysToAdd, 'days').utc();

            return {
                date: dateToCompare.toDate(),
                activities: trip.activities.filter((activity: { occursAt: Date }) => {
                    return dayjs.utc(activity.occursAt).isSame(dateToCompare, 'day');
                }),
            };
        });

        return activities;
    }

    async function getTripActivities() {
        try {
            const activities = await getActivitiesByTripId({ id: tripDetails.id })

            const activitiesToSectionList: any = activities.map((dayActivity) => ({
                title: {
                    dayNumber: dayjs(dayActivity.date).tz().date(),
                    dayName: dayjs(dayActivity.date).tz().format("dddd").replace("-feira", ""),
                },
                data: dayActivity.activities.sort((a: ActivityProps, b: ActivityProps) => dayjs(a.occursAt).tz().diff(dayjs(b.occursAt).tz())).map((activity: ActivityProps) => ({
                    id: activity.id,
                    title: activity.title,
                    hour: dayjs(activity.occursAt).tz().format("HH[:]mm"),
                    isBefore: dayjs(activity.occursAt).tz().isBefore(dayjs().clone().tz(TIME_ZONE, true)),
                    isDone: activity.isDone,
                    obs: activity.obs,
                })),
            }));

            setTripActivities(activitiesToSectionList)
        } catch (error) {
            console.log(error)
        }
    }

    async function handleCreateActivity() {
        try {
            const { title, date, hour, obs } = activity
            if (!title || !date || !hour) {
                return Alert.alert(t('trip.activities.addActivity'), t('trip.activities.fillRequiredFieldsMessage'))
            }

            setIsCreatingActivity(true)

            if (tripDetails.id) {
                const [hours, minutes] = hour.split(':').map(Number);
                const occursAt = dayjs(date).tz().hour(hours).minute(minutes).second(0).millisecond(0)

                await createActivity({ db, tripId: tripDetails.id, occursAt, title, obs })
            }

            Alert.alert(t('trip.activities.newActivity'), t('trip.activities.newActivitySuccessMessage'))

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
            const { id, title, date, hour, obs } = activity
            if (!title || !date || !hour) {
                return Alert.alert(t('trip.activities.updateActivity'), t('trip.activities.fillRequiredFieldsMessage'))
            }

            setIsCreatingActivity(true)

            if (tripDetails.id) {
                const [hours, minutes] = hour.replace('h', '').split(':').map(Number);

                const occursAt = dayjs(date).tz().hour(hours).minute(minutes).second(0).millisecond(0)

                await updateActivityById({ db, id: parseInt(id), occursAt, title, obs })
            }

            Alert.alert(t('trip.activities.updateActivity'), t('trip.activities.updateActivitySuccessMessage'))

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
            Alert.alert(t('trip.activities.removeActivity'), t('trip.activities.removeActivityMessage'), [
                {
                    text: t('trip.no'),
                    style: "cancel",
                },
                {
                    text: t('trip.yes'),
                    onPress: async () => {
                        await deleteActivitiesById({ db, id })

                        await getTripActivities()
                        resetNewActivityFields()
                    },
                },
            ])
        } catch (error) {
            console.log(error)
        }
    }

    async function handleLongPressActivity({ id }: { id: string }) {
        try {
            Alert.alert(t('trip.activities.activityDone'), t('trip.activities.activityDoneMessage'), [
                {
                    text: t('trip.no'),
                    style: "cancel",
                },
                {
                    text: t('trip.yes'),
                    onPress: async () => {
                        await updateActivityDone({ db, id: parseInt(id) })

                        await getTripActivities()
                    },
                },
            ])
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getTripActivities()
    }, [tripDetails.id, tripDetails.scheduleDate])


    return {
        activity,
        stepForm,
        showModal,
        tripActivities,
        isCreatingActivity,
        setActivity,
        setShowModal,
        handleHourChange,
        handleNewActivity,
        handleCreateActivity,
        handleUpdateActivity,
        handleRemoveActivity,
        resetNewActivityFields,
        handleLongPressActivity,
        handleUpdateActivityModal,
    }
}