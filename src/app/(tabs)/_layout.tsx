import { colors } from '@/styles/colors';
import { Tabs } from 'expo-router';
import { Plane, TicketsPlane } from 'lucide-react-native'

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: colors.purple[900],
                tabBarStyle: {
                    height: 90,
                },
                tabBarActiveBackgroundColor: colors.zinc[100],
                headerShown: false
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Próximo destino',
                    tabBarIcon: ({ color }) => <Plane size={28} color={colors.purple[900]} />,
                    tabBarItemStyle: {
                        paddingBottom: 8
                    }
                }}
            />
            <Tabs.Screen
                name="trip-list"
                options={{
                    title: 'Minhas viagens',
                    tabBarIcon: ({ color }) => <TicketsPlane size={28} color={colors.purple[900]} />,
                    tabBarItemStyle: {
                        paddingBottom: 8
                    }
                }}
            />
        </Tabs>
    );
}
