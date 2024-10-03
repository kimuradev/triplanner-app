import '@/styles/global.css';
import "@/utils/dayjsLocaleConfig"

import { useFonts } from "expo-font";
import { Stack } from 'expo-router/stack';
import { StatusBar } from "expo-status-bar";
import {
    PlusJakartaSans_700Bold,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_800ExtraBold
} from "@expo-google-fonts/plus-jakarta-sans"
import { TripContextProvider } from '@/context/trip-context';

export default function Layout() {
    const [fontsLoaded] = useFonts({
        PlusJakartaSans_700Bold,
        PlusJakartaSans_500Medium,
        PlusJakartaSans_400Regular,
        PlusJakartaSans_800ExtraBold
    })

    if (!fontsLoaded) return null;

    return (
        <TripContextProvider>
            <StatusBar style="dark" backgroundColor="transparent" translucent />
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="(trip)/trip-details/[id]" options={{ title: 'Detalhes da viagem', headerBackTitle: 'Voltar' }} />
            </Stack>
        </TripContextProvider>
    );
}

