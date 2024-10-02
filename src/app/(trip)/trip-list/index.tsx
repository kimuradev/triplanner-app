import { Text } from 'react-native';
import { router } from 'expo-router';
import { Search as SearchIcon } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/styles/colors';
import { Search } from '@/components/search';
import { TripCard } from '@/components/trip-card';
import { useTripList } from './useTripList';

export default function TripListScreen() {
    const {
        filteredTrips,
        searchDestination,
        calculateProgress,
        handleDestination
    } = useTripList();

    return (
        <SafeAreaView style={{ backgroundColor: colors.yellow[100], flex: 1, padding: 16, gap: 16 }}>
            <Search>
                <SearchIcon color={colors.zinc[400]} size={20} />
                <Search.Field
                    placeholder="Pesquisar por cidade ou país..."
                    onChangeText={handleDestination}
                    value={searchDestination}
                />
            </Search>

            {filteredTrips.length > 0 ? (
                filteredTrips.map(item => (
                    <TripCard
                        key={item.id}
                        data={{ destination: item.destination, scheduleDate: item.scheduleDate, activities: item.activities }}
                        progress={calculateProgress(item.activities)}
                        handlePress={() => router.navigate(`/trip-details/${item.id}`)}
                    />
                ))
            ) : (
                <Text className='text-center mt-5 text-purple-900 text-lg'>Nenhum destino encontrado.</Text>
            )}
        </SafeAreaView>
    );
}