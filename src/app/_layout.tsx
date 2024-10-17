import '@/styles/global.css';
import "@/utils/dayjsLocaleConfig"

import { ActivityIndicator, Text, View } from "react-native";
import { useFonts } from "expo-font";
import { Stack } from 'expo-router/stack';
import { StatusBar } from "expo-status-bar";
import {
    PlusJakartaSans_700Bold,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_800ExtraBold
} from "@expo-google-fonts/plus-jakarta-sans"
import { useTranslation } from 'react-i18next';
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { openDatabaseSync, SQLiteProvider } from "expo-sqlite/next";

import '@/i18n';
import migrations from '../../drizzle/migrations';

const DATABASE_NAME = "database.db"
const expoDb = openDatabaseSync(DATABASE_NAME);
const db = drizzle(expoDb);

export default function Layout() {
    if (!process.env.EXPO_PUBLIC_DISABLE_FEATURE) {
        useDrizzleStudio(expoDb)
    }
    const { t } = useTranslation()
    const { success, error } = useMigrations(db, migrations);

    const [fontsLoaded] = useFonts({
        PlusJakartaSans_700Bold,
        PlusJakartaSans_500Medium,
        PlusJakartaSans_400Regular,
        PlusJakartaSans_800ExtraBold
    })

    if (error) {
        return (
            <View className="flex-1 justify-center items-center bg-red-300">
                <Text>Error: {error.message}</Text>
            </View>
        );
    }
    if (!success || !fontsLoaded) {
        return (
            <ActivityIndicator className="flex-1 justify-center items-center" />
        );
    }

    return (
        <SQLiteProvider databaseName={DATABASE_NAME}>
            <StatusBar style="dark" backgroundColor="transparent" translucent />
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="(trip)/trip-details/[id]" options={{ title: t('trip.header'), headerBackTitle: t('trip.back') }} />
            </Stack>
        </SQLiteProvider>
    );
}

