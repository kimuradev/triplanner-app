import { Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { useTranslation } from "react-i18next";
import { Plane, TicketsPlane } from 'lucide-react-native'

import { colors } from '@/styles/colors';

export default function TabLayout() {
    const { t } = useTranslation();

    return (
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
                    title: t('tabs.nextDestination'),
                    tabBarIcon: ({ color }) => <Plane size={32} color={colors.purple[900]} />,
                    tabBarItemStyle: {
                        paddingBottom: 8,
                    }
                }}
            />
            <Tabs.Screen
                name="trip-list"
                options={{
                    title: t('tabs.myTrips'),
                    tabBarIcon: ({ color }) => <TicketsPlane size={32} color={colors.purple[900]} />,
                    tabBarItemStyle: {
                        paddingBottom: 8
                    }
                }}
            />
        </Tabs>
    );
}
