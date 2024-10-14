import { Text, View } from "react-native";
import { MapPin } from "lucide-react-native";

import { colors } from "@/styles/colors";

import PressableOpacity from "./pressable";
import { ProgressBar } from "./progress-bar";
import { getTotalActivityCompleted } from "@/utils/activityUtils";
import { ActivityProps } from "@/app/(trip)/trip-details/constants";

type TripDataProps = {
    destination: string,
    scheduleDate: string,
    activities: ActivityProps[]
}

type TripCardProps = {
    data: TripDataProps,
    progress: number,
    handlePress: () => void
}

export function TripCard({ data, progress, handlePress }: TripCardProps) {
    const { destination, scheduleDate, activities } = data;

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
                        <Text className='text-white font-bold'>{getTotalActivityCompleted(activities) || '0'}/{activities.length || '0'}</Text>
                    </View>
                </View>
            </View>
            <View className='w-full'>
                <ProgressBar progress={progress} />
            </View>
        </PressableOpacity>
    )
}