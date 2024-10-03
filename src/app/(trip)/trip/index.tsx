import { useState } from 'react';
import { View, Image, Text, Keyboard } from 'react-native';
import dayjs from 'dayjs';
import { MapPin, Calendar as IconCalendar, ArrowRight, Settings2, } from 'lucide-react-native';

import { colors } from '@/styles/colors';
import { Input } from '@/components/input';
import { Modal } from '@/components/modal';
import { Button } from "@/components/button"
import { Calendar } from '@/components/calendar';
import { MODAL, StepForm } from '@/utils/constants';

import { useTrip } from './useTrip';

export default function TripScreen() {
  const [showModal, setShowModal] = useState(MODAL.NONE)
  
  const {
    destination,
    isCreatingTrip,
    selectedDates,
    stepForm,
    setStepForm,
    handleDestination,
    handleNextStepForm,
    handleSelectDate
  } = useTrip();

  return (
    <View className="flex-1 items-center justify-center px-5 bg-yellow-100">
      <Image
        className="h-8"
        resizeMode="contain"
        source={require('@/assets/logo.png')}
      />

      <Image
        className='absolute'
        source={require('@/assets/bg.png')}
      />

      <Text className="text-zinc-400 font-regular text-center text-lg mt-3">
        Planeje sua próxima viagem
      </Text>

      <View className="w-full bg-white p-4 rounded-xl my-8 border border-zinc-200 gap-2">
        <Input>
          <MapPin color={destination?.length && stepForm === StepForm.TRIP_DETAILS ? colors.purple[900] : colors.zinc[400]} size={20} />
          <Input.Field
            placeholder="Para onde?"
            editable={stepForm === StepForm.TRIP_DETAILS}
            onChangeText={handleDestination}
            value={destination}
          />
        </Input>

        <Input>
          <IconCalendar color={selectedDates?.formatDatesInText?.length && stepForm === StepForm.TRIP_DETAILS ? colors.purple[900] : colors.zinc[400]} size={20} />
          <Input.Field
            placeholder="Quando?"
            editable={stepForm === StepForm.TRIP_DETAILS}
            onFocus={() => Keyboard.dismiss()}
            showSoftInputOnFocus={false}
            onPressIn={() =>
              stepForm === StepForm.TRIP_DETAILS && setShowModal(MODAL.CALENDAR)
            }
            value={selectedDates.formatDatesInText}
          />
        </Input>

        <View className='gap-2 mt-4'>
          {stepForm === StepForm.TRIP_CONFIRMATION && (
            <Button
              variant="secondary"
              onPress={() => setStepForm(StepForm.TRIP_DETAILS)}
            >
              <Button.Title>Alterar local/data</Button.Title>
              <Settings2 color={colors.purple[900]} size={20} />
            </Button>
          )}

          <Button onPress={handleNextStepForm} isLoading={isCreatingTrip}>
            <Button.Title>
              {stepForm === StepForm.TRIP_DETAILS
                ? "Continuar"
                : "Confirmar Viagem"}
            </Button.Title>
            <ArrowRight color={colors.white} size={20} />
          </Button>
        </View>
      </View>

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

          <Button onPress={() => setShowModal(MODAL.NONE)}>
            <Button.Title>Confirmar</Button.Title>
          </Button>
        </View>
      </Modal>
    </View>
  );
}