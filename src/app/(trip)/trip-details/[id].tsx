import { colors } from '@/styles/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function TripListScreen() {
    const tripParams = useLocalSearchParams<{
        id: string
    }>()

    return (
        <SafeAreaView style={{ backgroundColor: colors.yellow[100], flex: 1, padding: 16, gap: 16 }}>
            <Text>{tripParams.id}</Text>
        </SafeAreaView>
    );
}