import { useState } from "react";
import { Keyboard, SectionList, Text, View } from "react-native";

import dayjs from "dayjs";
import { Clock, Calendar as IconCalendar, PlusIcon, Tag } from "lucide-react-native";

import { colors } from "@/styles/colors";
import { Input } from "@/components/input";
import { Modal } from "@/components/modal";
import { Button } from "@/components/button";
import { Calendar } from "@/components/calendar";
import { formatHour } from "@/utils/hourUtils";
import { Activity } from "@/components/activity";
import PressableOpacity from "@/components/pressable";

export type ActivityProps = {
    id: string
    title: string
    hour: string
    isBefore: boolean
    date: string
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

export function Activities({ tripDetails }: any) {
    const [showModal, setShowModal] = useState(MODAL.NONE)
    const [stepForm, setStepForm] = useState(StepForm.NEW_ACTIVITY)

    const [isCreatingActivity, setIsCreatingActivity] = useState(false)

    const [activity, setActivity] = useState({ title: '', hour: '', date: '' })

    function resetNewActivityFields() {
        setActivity({ title: '', hour: '', date: '' })
        setShowModal(MODAL.NONE)
    }

    // LISTS
    const [tripActivities, setTripActivities] = useState<TripActivities[]>(
        [
            {
                "data": [
                    {
                        "date": "2024-10-08",
                        "hour": "12:00h",
                        "id": "1",
                        "isBefore": true,
                        "title": "Corrida"
                    }
                ],
                "title": {
                    "dayName": "quinta",
                    "dayNumber": 3
                }
            },
            {
                "data": [
                    {
                        "date": "2024-10-09",
                        "hour": "15:00h",
                        "id": "2",
                        "isBefore": false,
                        "title": "Almoco"
                    },
                    {
                        "date": "2024-10-09",
                        "hour": "19:00h",
                        "id": "3",
                        "isBefore": false,
                        "title": "Janta"
                    }
                ],
                "title": {
                    "dayName": "sexta",
                    "dayNumber": 4
                }
            },
            {
                "data": [
                    {
                        "date": "2024-10-10",
                        "hour": "09:00h",
                        "id": "4",
                        "isBefore": false,
                        "title": "Passeio"
                    }
                ],
                "title": {
                    "dayName": "sábado",
                    "dayNumber": 5
                }
            },
            {
                "data": [],
                "title": {
                    "dayName": "domingo",
                    "dayNumber": 6
                }
            },
            {
                "data": [],
                "title": {
                    "dayName": "segunda",
                    "dayNumber": 7
                }
            }
        ]
    )


    const handleHourChange = (text: string) => {
        const formattedHour = formatHour(text);
        setActivity(state => ({
            ...state,
            hour: formattedHour
        }))
    };

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

            setActivity({ title, hour, date })
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
                        initialDate={tripDetails.starts_at.toString()}
                        minDate={tripDetails.starts_at.toString()}
                        maxDate={tripDetails.ends_at.toString()}
                    />

                    <Button onPress={() => stepForm === StepForm.NEW_ACTIVITY ? setShowModal(MODAL.NEW_ACTIVITY) : setShowModal(MODAL.UPDATE_ACTIVITY)}>
                        <Button.Title>Confirmar</Button.Title>
                    </Button>
                </View>
            </Modal>
        </View>
    )
}