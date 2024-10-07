import { useEffect, useState } from "react";
import { Keyboard, SectionList, Text, View } from "react-native";

import dayjs from "dayjs";
import { eq } from "drizzle-orm";
import { Clock, Calendar as IconCalendar, PlusIcon, Tag } from "lucide-react-native";

import { colors } from "@/styles/colors";
import { Input } from "@/components/input";
import { Modal } from "@/components/modal";
import { Button } from "@/components/button";
import { Calendar } from "@/components/calendar";
import { formatHour } from "@/utils/dateTimeUtils";
import { Activity } from "@/components/activity";
import PressableOpacity from "@/components/pressable";
import { useDatabase } from "@/db/useDatabase";
import * as tripSchema from '@/db/schemas/schema'
import { TripDataProps } from "../definition";

export type ActivityProps = {
    id: string
    title: string
    hour: string
    isBefore: boolean
    date?: string
}

type TripActivities = {
    title: {
        dayNumber: number
        dayName: string
    }
    data: ActivityProps[]
}

enum MODAL {
    NONE = 0,
    CALENDAR = 1,
    NEW_ACTIVITY = 2,
    UPDATE_ACTIVITY = 3,
}

export enum StepForm {
    NEW_ACTIVITY = 1,
    UPDATE_ACTIVITY = 2,
}

export function Activities({ tripDetails }: { tripDetails: TripDataProps }) {
    const { db } = useDatabase<typeof tripSchema>({ schema: tripSchema })

    const [showModal, setShowModal] = useState(MODAL.NONE)
    const [stepForm, setStepForm] = useState(StepForm.NEW_ACTIVITY)

    const [isCreatingActivity, setIsCreatingActivity] = useState(false)
    const [isLoadingActivities, setIsLoadingActivities] = useState(true)

    const [activity, setActivity] = useState({ title: '', hour: '', date: '' })
    const [tripActivities, setTripActivities] = useState<TripActivities[]>([])

    function resetNewActivityFields() {
        setActivity({ title: '', hour: '', date: '' })
        setShowModal(MODAL.NONE)
    }

    const handleHourChange = (text: string) => {
        const formattedHour = formatHour(text);
        setActivity(state => ({
            ...state,
            hour: formattedHour
        }))
    };

    const getActivitiesByTripId = async ({ id }: { id: number | undefined }) => {
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
            const dateToCompare = dayjs(trip.startsAt).add(daysToAdd, 'days')

            return {
                date: dateToCompare.toDate(),
                activities: trip.activities.filter((activity) => {
                    return dayjs(activity.occursAt).isSame(dateToCompare, 'day')
                }),
            }
        })

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

    useEffect(() => {
        getTripActivities()
    }, [tripDetails.id])

    const handleCreateTripActivity = () => { }

    const handleNewActivity = () => {
        setShowModal(MODAL.NEW_ACTIVITY)
        setStepForm(StepForm.NEW_ACTIVITY)
    }

    const handleUpdateActivity = (id: string) => {
        setShowModal(MODAL.UPDATE_ACTIVITY);
        setStepForm(StepForm.UPDATE_ACTIVITY)

        const filteredTripActivities = tripActivities.map((activity) => ({
            ...activity,
            data: activity.data.filter(item => item.id === id)
        })).filter(activity => activity.data.length > 0);

        if (filteredTripActivities[0].data) {
            const { title, hour, date } = filteredTripActivities[0].data[0];

            setActivity({ title: title ?? '', hour: hour ?? '', date: date ?? '' })
        }
    }

    return (
        <View className="flex-1">
            <View className="w-full flex-row justify-end mt-5 mb-6 items-center">
                <Button className="flex-row items-center justify-center px-4" onPress={handleNewActivity}>
                    <Button.Title>Nova atividade</Button.Title>
                    <PlusIcon color={colors.white} size={18} />
                </Button>
            </View>

            <SectionList
                sections={tripActivities}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                    return item.isBefore ? <Activity data={item} /> : (
                        <PressableOpacity onPress={() => handleUpdateActivity(item.id)}>
                            <Activity data={item} />
                        </PressableOpacity>
                    )
                }}
                renderSectionHeader={({ section }) => (
                    <View className="w-full">
                        <Text className="text-purple-300 text-2xl font-semibold py-2">
                            Dia {section.title.dayNumber + " "}
                            <Text className="text-purple-500 text-base font-regular capitalize">
                                {section.title.dayName}
                            </Text>
                        </Text>

                        {section.data.length === 0 && (
                            <Text className="text-purple-300 font-regular text-sm mb-8">
                                Nenhuma atividade cadastrada nessa data.
                            </Text>
                        )}
                    </View>
                )}
                contentContainerClassName="gap-3 pb-48"
                showsVerticalScrollIndicator={false}
            />

            <Modal
                visible={showModal === MODAL.NEW_ACTIVITY}
                title="Cadastrar atividade"
                subtitle="Todos os convidados podem visualizar as atividades"
                onClose={resetNewActivityFields}
            >
                <View className="mt-4 mb-3">
                    <Input variant="secondary">
                        <Tag color={activity.title?.length ? colors.purple[900] : colors.zinc[400]} size={20} />
                        <Input.Field
                            placeholder="Qual atividade?"
                            onChangeText={value => setActivity(state => ({
                                ...state,
                                title: value
                            }))}
                            value={activity.title}
                            editable
                        />
                    </Input>

                    <View className="w-full mt-2 flex-row gap-2">
                        <Input variant="secondary" className="flex-1">
                            <IconCalendar color={activity.date?.length ? colors.purple[900] : colors.zinc[400]} size={20} />
                            <Input.Field
                                placeholder="Data"
                                onChangeText={value => setActivity(state => ({
                                    ...state,
                                    date: value
                                }))}
                                value={
                                    activity.date ? dayjs(activity.date).format("DD [de] MMMM") : ""
                                }
                                onFocus={() => Keyboard.dismiss()}
                                showSoftInputOnFocus={false}
                                onPressIn={() => setShowModal(MODAL.CALENDAR)}
                                editable
                            />
                        </Input>

                        <Input variant="secondary" className="flex-1">
                            <Clock color={activity.hour?.length ? colors.purple[900] : colors.zinc[400]} size={20} />
                            <Input.Field
                                placeholder="Horário?"
                                onChangeText={handleHourChange}
                                value={activity.hour}
                                keyboardType="numeric"
                                maxLength={5}
                                editable
                            />
                        </Input>
                    </View>
                </View>

                <Button
                    onPress={handleCreateTripActivity}
                    isLoading={isCreatingActivity}
                >
                    <Button.Title>Salvar atividade</Button.Title>
                </Button>
            </Modal>

            <Modal
                visible={showModal === MODAL.UPDATE_ACTIVITY}
                title="Atualizar atividade"
                subtitle="Todos os convidados podem visualizar as atividades"
                onClose={resetNewActivityFields}
            >
                <View className="mt-4 mb-3">
                    <Input variant="secondary">
                        <Tag color={activity.title?.length ? colors.purple[900] : colors.zinc[400]} size={20} />
                        <Input.Field
                            placeholder="Qual atividade?"
                            onChangeText={value => setActivity(state => ({
                                ...state,
                                title: value
                            }))}
                            value={activity.title}
                            editable
                        />
                    </Input>

                    <View className="w-full mt-2 flex-row gap-2">
                        <Input variant="secondary" className="flex-1">
                            <IconCalendar color={activity.date?.length ? colors.purple[900] : colors.zinc[400]} size={20} />
                            <Input.Field
                                placeholder="Data"
                                onChangeText={value => setActivity(state => ({
                                    ...state,
                                    date: value
                                }))}
                                value={
                                    activity.date ? dayjs(activity.date).format("DD [de] MMMM") : ""
                                }
                                onFocus={() => Keyboard.dismiss()}
                                showSoftInputOnFocus={false}
                                onPressIn={() => setShowModal(MODAL.CALENDAR)}
                                editable
                            />
                        </Input>

                        <Input variant="secondary" className="flex-1">
                            <Clock color={activity.hour?.length ? colors.purple[900] : colors.zinc[400]} size={20} />
                            <Input.Field
                                placeholder="Horário?"
                                onChangeText={handleHourChange}
                                value={activity.hour}
                                keyboardType="numeric"
                                maxLength={5}
                                editable
                            />
                        </Input>
                    </View>
                </View>

                <Button
                    onPress={handleCreateTripActivity}
                    isLoading={isCreatingActivity}
                >
                    <Button.Title>Atualizar atividade</Button.Title>
                </Button>
            </Modal>

            <Modal
                title="Selecionar data"
                subtitle="Selecione a data da atividade"
                visible={showModal === MODAL.CALENDAR}
                onClose={() => setShowModal(MODAL.NONE)}
            >
                <View className="gap-4 mt-4">
                    <Calendar
                        onDayPress={(day) => setActivity(state => ({
                            ...state,
                            date: day.dateString
                        }))}
                        markedDates={{ [activity.date]: { selected: true } }}
                        initialDate={tripDetails?.startsAt?.toString()}
                        minDate={tripDetails?.startsAt?.toString()}
                        maxDate={tripDetails?.endsAt?.toString()}
                    />

                    <Button onPress={() => stepForm === StepForm.NEW_ACTIVITY ? setShowModal(MODAL.NEW_ACTIVITY) : setShowModal(MODAL.UPDATE_ACTIVITY)}>
                        <Button.Title>Confirmar</Button.Title>
                    </Button>
                </View>
            </Modal>
        </View>
    )
}