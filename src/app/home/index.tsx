import { MapPin, Calendar as IconCalendar, ArrowRight, Settings2, } from 'lucide-react-native';
import { View, Image, TextInput, Text, Keyboard } from 'react-native';

import { Input } from '@/components/input';
import { Button } from "@/components/button"
import { useState } from 'react';
import { colors } from '@/styles/colors';

enum StepForm {
  TRIP_DETAILS = 1,
  TRIP_CONFIRMATION = 2,
}

export default function Home() {
  const [isCreatingTrip, setIsCreatingTrip] = useState(false)
  const [stepForm, setStepForm] = useState(StepForm.TRIP_DETAILS)
  const [selectedDates, setSelectedDates] = useState({})
  const [destination, setDestination] = useState("")

  const handleNextStepForm = () => {
    setStepForm(StepForm.TRIP_CONFIRMATION)
  }

  return (
    <View className="flex-1 items-center justify-center px-5 bg-yellow100">
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


      <View className="w-full bg-white p-4 rounded-xl my-8 border border-zinc-200">
        <Input>
          <MapPin color={colors.zinc[400]} size={20} />
          <Input.Field
            placeholder="Para onde?"
            editable={stepForm === StepForm.TRIP_DETAILS}
            onChangeText={setDestination}
            value={destination}
          />
        </Input>

        <Input>
          <IconCalendar color={colors.zinc[400]} size={20} />
          <Input.Field
            placeholder="Quando?"
            editable={stepForm === StepForm.TRIP_DETAILS}
            onFocus={() => Keyboard.dismiss()}
            showSoftInputOnFocus={false}
          // onPressIn={() =>
          //   stepForm === StepForm.TRIP_DETAILS && setShowModal(MODAL.CALENDAR)
          // }
          // value={selectedDates.formatDatesInText}
          />
        </Input>

        <View className='gap-2'>
          {stepForm === StepForm.TRIP_CONFIRMATION && (
            <Button
              variant="secondary"
              onPress={() => setStepForm(StepForm.TRIP_DETAILS)}
            >
              <Button.Title>Alterar local/data</Button.Title>
              <Settings2 color={colors.purple900} size={20} />
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

    </View>
  );
}