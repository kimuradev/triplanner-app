import { useEffect, useState } from 'react';
import { Alert, Keyboard, Text, TouchableOpacity, View } from 'react-native';
import dayjs from 'dayjs';
import { eq } from 'drizzle-orm';
import { DateData } from 'react-native-calendars';
import { router, useLocalSearchParams } from 'expo-router';
import { Calendar as IconCalendar, MapPin } from 'lucide-react-native';

import { Input } from '@/components/input';
import { Modal } from '@/components/modal';
import { Calendar } from '@/components/calendar';
import { Button } from '@/components/button';
import { TripCardDetails } from '@/components/trip-card-details';
import { calendarUtils, DatesSelected } from '@/utils/calendarUtils';
import { colors } from '@/styles/colors';
import { Activities } from './activities';
import { useDatabase } from "@/db/useDatabase"
import * as tripSchema from '@/db/schemas/schema'
import { formatTimestampToDate } from '@/utils/dateTimeUtils';

import { TripDataProps } from '../definition';

enum MODAL {
    NONE = 0,
    UPDATE_TRIP = 1,
    CALENDAR = 2,
}

export default function TripListScreen() {
    const [data, setData] = useState<TripDataProps>({
        destination: '',
        scheduleDate: ''
    })
    const { db } = useDatabase<typeof tripSchema>({ schema: tripSchema })
    const [isUpdatingTrip, setIsUpdatingTrip] = useState(false)
    const [showModal, setShowModal] = useState(MODAL.NONE)

    const [destination, setDestination] = useState("")
    const [selectedDates, setSelectedDates] = useState({} as DatesSelected)

    const tripParams = useLocalSearchParams<{
        id: string
    }>()

    async function getTripById({ id }: { id: string }) {
        try {
            const response = await db.query.trip.findFirst({
                with: {
                    activities: true
                },
                where: eq(tripSchema.trip.id, parseInt(id))
            })

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
            if (!tripParams.id) {
                return
            }

            if (!destination || !selectedDates.startsAt || !selectedDates.endsAt) {
                return Alert.alert(
                    "Atualizar viagem",
                    "Lembre-se de, além de preencher o destino, selecione data de início e fim da viagem."
                )
            }

            setIsUpdatingTrip(true)

            await db
                .update(tripSchema.trip)
                .set({
                    destination: destination,
                    startsAt: formatTimestampToDate(selectedDates.startsAt?.timestamp),
                    endsAt: formatTimestampToDate(selectedDates.endsAt.timestamp),
                    scheduleDate: calendarUtils.formatDatesInText({
                        startsAt: dayjs(formatTimestampToDate(selectedDates.startsAt?.timestamp)).tz(),
                        endsAt: dayjs(formatTimestampToDate(selectedDates.endsAt.timestamp)).tz()
                    })
                })
                .where(eq(tripSchema.trip.id, parseInt(tripParams.id)));

            Alert.alert("Atualizar viagem", "Viagem atualizada com sucesso!", [
                {
                    text: "OK",
                    onPress: () => {
                        setShowModal(MODAL.NONE)
                        getTripById({ id: tripParams.id })
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
            Alert.alert("Remover viagem", "Tem certeza que deseja remover a viagem", [
                {
                    text: "Não",
                    style: "cancel",
                },
                {
                    text: "Sim",
                    onPress: async () => {
                        await db
                            .delete(tripSchema.trip)
                            .where(eq(tripSchema.trip.id, id))

                        router.navigate('/')
                    },
                },
            ])
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getTripById({ id: tripParams.id })
    }, [tripParams.id])

    function handleSelectDate(selectedDay: DateData) {
        const dates = calendarUtils.orderStartsAtAndEndsAt({
            startsAt: selectedDates.startsAt,
            endsAt: selectedDates.endsAt,
            selectedDay,
        })

        setSelectedDates(dates)
    }

    return (
        <View className='flex-1 bg-yellow-100 p-4'>
            <TripCardDetails data={data} handlePress={() => setShowModal(MODAL.UPDATE_TRIP)} />

            <Modal
                title="Atualizar viagem"
                subtitle="Somente quem criou a viagem pode editar."
                visible={showModal === MODAL.UPDATE_TRIP}
                onClose={() => setShowModal(MODAL.NONE)}
            >
                <View className="gap-2 my-4">
                    <Input variant="secondary">
                        <MapPin color={destination?.length ? colors.purple[900] : colors.zinc[400]} size={20} />
                        <Input.Field
                            placeholder="Para onde?"
                            onChangeText={setDestination}
                            value={destination}
                            editable
                        />
                    </Input>

                    <Input variant="secondary">
                        <IconCalendar color={selectedDates.formatDatesInText?.length ? colors.purple[900] : colors.zinc[400]} size={20} />

                        <Input.Field
                            placeholder="Quando?"
                            value={selectedDates.formatDatesInText}
                            onPressIn={() => setShowModal(MODAL.CALENDAR)}
                            onFocus={() => Keyboard.dismiss()}
                            editable
                        />
                    </Input>
                </View>

                <Button onPress={() => handleUpdateTrip({ id: parseInt(tripParams.id) })} isLoading={isUpdatingTrip}>
                    <Button.Title>Atualizar</Button.Title>
                </Button>

                <TouchableOpacity activeOpacity={0.8} onPress={() => handleRemoveTrip({ id: parseInt(tripParams.id) })}>
                    <Text className="text-red-400 text-center mt-6">Remover viagem</Text>
                </TouchableOpacity>
            </Modal>

            <Modal
                title="Selecionar datas"
                subtitle="Selecione a data de ida e volta da viagem"
                visible={showModal === MODAL.CALENDAR}
                onClose={() => setShowModal(MODAL.NONE)}
            >
                <View className="gap-4 mt-4">
                    <Calendar
                        minDate={dayjs().toISOString()}
                        onDayPress={handleSelectDate}
                        markedDates={selectedDates.dates}
                    />

                    <Button onPress={() => setShowModal(MODAL.UPDATE_TRIP)}>
                        <Button.Title>Confirmar</Button.Title>
                    </Button>
                </View>
            </Modal>

            <Activities tripDetails={data}/>
        </View>
    );
}