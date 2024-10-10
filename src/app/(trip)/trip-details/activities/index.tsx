import { Keyboard, SectionList, Text, TouchableOpacity, View } from "react-native";

import dayjs from "dayjs";
import { Clock, Calendar as IconCalendar, PlusIcon, Tag } from "lucide-react-native";

import { colors } from "@/styles/colors";
import { Input } from "@/components/input";
import { Modal } from "@/components/modal";
import { Button } from "@/components/button";
import { Calendar } from "@/components/calendar";
import { Activity } from "@/components/activity";
import PressableOpacity from "@/components/pressable";

import { useActivity } from "./useActivity";
import { ActivityModal, StepForm, TripDataProps } from "../constants";

export function Activities({ tripDetails }: { tripDetails: TripDataProps }) {
    const {
        activity,
        stepForm,
        showModal,
        tripActivities,
        isCreatingActivity,
        setActivity,
        setShowModal,
        handleHourChange,
        handleNewActivity,
        handleUpdateActivity,
        handleRemoveActivity,
        resetNewActivityFields,
        handleCreateTripActivity,
        handleUpdateActivityModal,
    } = useActivity({ tripDetails })


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
                        <PressableOpacity onPress={() => handleUpdateActivityModal(item.id)}>
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
                visible={showModal === ActivityModal.NEW_ACTIVITY}
                title="Cadastrar atividade"
                subtitle="As atividades serão automaticamente concluídas após o horário."
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
                                onPressIn={() => setShowModal(ActivityModal.CALENDAR)}
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
                visible={showModal === ActivityModal.UPDATE_ACTIVITY}
                title="Atualizar atividade"
                subtitle="As atividades serão automaticamente concluídas após o horário."
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
                                onPressIn={() => setShowModal(ActivityModal.CALENDAR)}
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

                <View>

                    <Button
                        onPress={handleUpdateActivity}
                        isLoading={isCreatingActivity}
                    >
                        <Button.Title>Atualizar atividade</Button.Title>
                    </Button>

                    <TouchableOpacity activeOpacity={0.8} onPress={() => handleRemoveActivity({ id: parseInt(activity.id) })}>
                        <Text className="text-red-400 text-center mt-6">Remover atividade</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            <Modal
                title="Selecionar data"
                subtitle="Selecione a data da atividade"
                visible={showModal === ActivityModal.CALENDAR}
                onClose={() => setShowModal(ActivityModal.NONE)}
            >
                <View className="gap-4 mt-4">
                    <Calendar
                        onDayPress={(day) => setActivity(state => ({
                            ...state,
                            date: day.dateString
                        }))}
                        markedDates={{ [activity.date]: { selected: true } }}
                        initialDate={tripDetails?.startsAt?.toString()}
                        minDate={dayjs(tripDetails.startsAt).tz().format('YYYY-MM-DD')}
                        maxDate={dayjs(tripDetails.endsAt).tz().format('YYYY-MM-DD')}
                    />

                    <Button onPress={() => stepForm === StepForm.NEW_ACTIVITY ? setShowModal(ActivityModal.NEW_ACTIVITY) : setShowModal(ActivityModal.UPDATE_ACTIVITY)}>
                        <Button.Title>Confirmar</Button.Title>
                    </Button>
                </View>
            </Modal>
        </View>
    )
}