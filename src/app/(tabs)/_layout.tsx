import { Platform } from 'react-native';
import { ActivityIndicator, Text, View } from "react-native";

import { Tabs } from 'expo-router';
import { drizzle } from "drizzle-orm/expo-sqlite";
import { Plane, TicketsPlane } from 'lucide-react-native'
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { openDatabaseSync, SQLiteProvider } from "expo-sqlite/next";

import migrations from '../../../drizzle/migrations';

import { colors } from '@/styles/colors';

const DATABASE_NAME = "database.db"
const expoDb = openDatabaseSync(DATABASE_NAME);
const db = drizzle(expoDb);

export default function TabLayout() {
    useDrizzleStudio(expoDb)
    const { success, error } = useMigrations(db, migrations);

    if (error) {
        return (
            <View className="flex-1 justify-center items-center bg-red-300">
                <Text>Error: {error.message}</Text>
            </View>
        );
    }
    if (!success) {
        return (
            <ActivityIndicator className="flex-1 justify-center items-center" />
        );
    }

    return (
        <SQLiteProvider databaseName={DATABASE_NAME}>
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: colors.purple[900],
                    tabBarStyle: {
                        height: Platform.OS === "ios" ? 100 : 80,
                    },
                    tabBarActiveBackgroundColor: colors.zinc[100],
                    headerShown: false,
                    tabBarLabelStyle: {
                        fontSize: 14
                    }
                }}>
                <Tabs.Screen
                    name="index"
                    options={{
                        title: 'Próximo destino',
                        tabBarIcon: ({ color }) => <Plane size={32} color={colors.purple[900]} />,
                        tabBarItemStyle: {
                            paddingBottom: 8,
                        }
                    }}
                />
                <Tabs.Screen
                    name="trip-list"
                    options={{
                        title: 'Minhas viagens',
                        tabBarIcon: ({ color }) => <TicketsPlane size={32} color={colors.purple[900]} />,
                        tabBarItemStyle: {
                            paddingBottom: 8
                        }
                    }}
                />
            </Tabs>
        </SQLiteProvider>
    );
}
