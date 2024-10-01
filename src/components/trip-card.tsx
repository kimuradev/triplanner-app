import { Text, View } from "react-native";
import { MapPin } from "lucide-react-native";

import { colors } from "@/styles/colors";
import { ProgressBar } from "./progress-bar";

type TripDataProps = {
    destination: string,
    scheduleDate: string,
}

type TripCardProps = {
    data: TripDataProps,
    progress: number
}

export function TripCard({ data, progress }: TripCardProps) {
    return (
        <View
            className='bg-yellow-500 rounded-xl gap-2 p-4 shadow'
        >
            <View className='flex-row items-center justify-between'>
                <View className='flex-row items-center gap-2'>
                    <MapPin size={20} color={colors.purple[900]} />
                    <Text className='text-lg text-purple-900'>{data.destination}</Text>
                </View>
                <View className='flex-row items-center gap-4'>
                    <Text className='text-lg text-purple-900'>{data.scheduleDate}</Text>
                    <View className='bg-yellow-900 rounded p-3'>
                        <Text className='text-white font-bold shadow'>5/5</Text>
                    </View>
                </View>
            </View>
            <View className='w-full'>
                <ProgressBar progress={progress}/>
            </View>
        </View>
    )
}