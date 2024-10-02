import { useState } from "react";
import { Keyboard, View } from "react-native";
import dayjs from "dayjs";
import { Clock, Calendar as IconCalendar, PlusIcon, Tag } from "lucide-react-native";

import { colors } from "@/styles/colors";
import { Input } from "@/components/input";
import { Modal } from "@/components/modal";
import { Button } from "@/components/button";
import { Calendar } from "@/components/calendar";
import { formatHour } from "@/utils/hourUtils";

enum MODAL {
    NONE = 0,
    CALENDAR = 1,
    NEW_ACTIVITY = 2,
}

export function Activities({ tripDetails }: any) {
    const [showModal, setShowModal] = useState(MODAL.NONE)

    const [isCreatingActivity, setIsCreatingActivity] = useState(false)

    const [activityTitle, setActivityTitle] = useState("")
    const [activityHour, setActivityHour] = useState("")
    const [activityDate, setActivityDate] = useState("")

    const handleHourChange = (text: string) => {
        const formattedHour = formatHour(text);
        setActivityHour(formattedHour);
    };

    const handleCreateTripActivity = () => { }

    return (
        <View className="flex-1">
            <View className="w-full flex-row justify-end mt-5 mb-6 items-center">
                <Button className="flex-row items-center justify-center px-4" onPress={() => setShowModal(MODAL.NEW_ACTIVITY)}>
                    <Button.Title>Nova atividade</Button.Title>
                    <PlusIcon color={colors.white} size={18} />
                </Button>
            </View>

            <Modal
                visible={showModal === MODAL.NEW_ACTIVITY}
                title="Cadastrar atividade"
                subtitle="Todos os convidados podem visualizar as atividades"
                onClose={() => setShowModal(MODAL.NONE)}
            >
                <View className="mt-4 mb-3">
                    <Input variant="secondary">
                        <Tag color={activityTitle?.length ? colors.purple[900] : colors.zinc[400]} size={20} />
                        <Input.Field
                            placeholder="Qual atividade?"
                            onChangeText={setActivityTitle}
                            value={activityTitle}
                            editable
                        />
                    </Input>

                    <View className="w-full mt-2 flex-row gap-2">
                        <Input variant="secondary" className="flex-1">
                            <IconCalendar color={activityDate?.length ? colors.purple[900] : colors.zinc[400]} size={20} />
                            <Input.Field
                                placeholder="Data"
                                onChangeText={setActivityTitle}
                                value={
                                    activityDate ? dayjs(activityDate).format("DD [de] MMMM") : ""
                                }
                                onFocus={() => Keyboard.dismiss()}
                                showSoftInputOnFocus={false}
                                onPressIn={() => setShowModal(MODAL.CALENDAR)}
                                editable
                            />
                        </Input>

                        <Input variant="secondary" className="flex-1">
                            <Clock color={activityHour?.length ? colors.purple[900] : colors.zinc[400]} size={20} />
                            <Input.Field
                                placeholder="Horário?"
                                onChangeText={handleHourChange}
                                value={activityHour}
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
                title="Selecionar data"
                subtitle="Selecione a data da atividade"
                visible={showModal === MODAL.CALENDAR}
                onClose={() => setShowModal(MODAL.NONE)}
            >
                <View className="gap-4 mt-4">
                    <Calendar
                        onDayPress={(day) => setActivityDate(day.dateString)}
                        markedDates={{ [activityDate]: { selected: true } }}
                        initialDate={tripDetails.starts_at.toString()}
                        minDate={tripDetails.starts_at.toString()}
                        maxDate={tripDetails.ends_at.toString()}
                    />

                    <Button onPress={() => setShowModal(MODAL.NEW_ACTIVITY)}>
                        <Button.Title>Confirmar</Button.Title>
                    </Button>
                </View>
            </Modal>
        </View>
    )
}