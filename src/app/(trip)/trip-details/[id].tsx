import { Keyboard, Text, TouchableOpacity, View } from 'react-native';
import dayjs from 'dayjs';
import { useLocalSearchParams } from 'expo-router';
import { Calendar as IconCalendar, MapPin } from 'lucide-react-native';

import { colors } from '@/styles/colors';
import { Input } from '@/components/input';
import { Modal } from '@/components/modal';
import { Button } from '@/components/button';
import { Calendar } from '@/components/calendar';
import { TripCardDetails } from '@/components/trip-card-details';

import { Activities } from './activities';
import { TripDetailsModal } from './constants';
import { useTripDetails } from './useTripDetails';

export default function TripListScreen() {
    const tripParams = useLocalSearchParams<{
        id: string
    }>()

    const {
        data,
        showModal,
        destination,
        selectedDates,
        isUpdatingTrip,
        setShowModal,
        setDestination,
        handleUpdateTrip,
        handleRemoveTrip,
        handleSelectDate,
    } = useTripDetails({ tripId: tripParams.id });

    return (
        <View className='flex-1 bg-yellow-100 p-4'>
            <TripCardDetails data={data} handlePress={() => setShowModal(TripDetailsModal.UPDATE_TRIP)} />

            <Modal
                title="Atualizar viagem"
                subtitle="Somente quem criou a viagem pode editar."
                visible={showModal === TripDetailsModal.UPDATE_TRIP}
                onClose={() => setShowModal(TripDetailsModal.NONE)}
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
                            onPressIn={() => setShowModal(TripDetailsModal.CALENDAR)}
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
                visible={showModal === TripDetailsModal.CALENDAR}
                onClose={() => setShowModal(TripDetailsModal.NONE)}
            >
                <View className="gap-4 mt-4">
                    <Calendar
                        minDate={dayjs().toISOString()}
                        onDayPress={handleSelectDate}
                        markedDates={selectedDates.dates}
                    />

                    <Button onPress={() => setShowModal(TripDetailsModal.UPDATE_TRIP)}>
                        <Button.Title>Confirmar</Button.Title>
                    </Button>
                </View>
            </Modal>

            <Activities tripDetails={data} />
        </View>
    );
}