import { Text, View } from "react-native";
import { MapPin, Settings2 } from "lucide-react-native";

import { colors } from "@/styles/colors";
import PressableOpacity from "./pressable";

type TripDataDetailsProps = {
    destination: string,
    scheduleDate: string,
}

type TripCardDetailsProps = {
    data: TripDataDetailsProps | undefined,
    handlePress: () => void
}

export function TripCardDetails({ data, handlePress }: TripCardDetailsProps) {
    if (!data) {
        return null
    }

    const { destination, scheduleDate } = data;

    return (
        <PressableOpacity
            onPress={handlePress}
            className='bg-yellow-300 rounded-xl gap-2 p-4 shadow'
        >
            <View className='flex-row items-center justify-between'>
                <View className='flex-row items-center gap-2'>
                    <MapPin size={20} color={colors.purple[900]} />
                    <Text className='text-lg text-purple-900'>{destination}</Text>
                </View>
                <View className='flex-row items-center gap-4'>
                    <Text className='text-lg text-purple-900'>{scheduleDate}</Text>
                    <View className='bg-yellow-700 rounded p-3'>
                        <Settings2 color={colors.white} size={20} />
                    </View>
                </View>
            </View>
        </PressableOpacity>
    )
}