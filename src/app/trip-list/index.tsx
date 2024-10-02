import { useState } from 'react';
import { Text } from 'react-native';
import { router } from 'expo-router';
import { Search as SearchIcon } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/styles/colors';
import { Search } from '@/components/search';
import { TripCard } from '@/components/trip-card';

const data = [
    { id: 1, destination: 'Bahia, Brasil', scheduleDate: '17 a 19 de Abr.', progress: 1 },
    { id: 2, destination: 'Pernambuco, Brasil', scheduleDate: '17 a 19 de Abr.', progress: 0.7 },
    { id: 3, destination: 'Curitiba, Brasil', scheduleDate: '17 a 19 de Abr.', progress: 0.2 },
]

export default function TripListScreen() {
    const [searchDestination, setSearchDestination] = useState('');

    const handleDestination = (text: string) => {
        setSearchDestination(text);
    };

    const filteredTrips = data.filter((item) =>
        item.destination.toLowerCase().includes(searchDestination.toLowerCase())
    );

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
                        data={{ destination: item.destination, scheduleDate: item.scheduleDate }}
                        progress={item.progress}
                        handlePress={() => router.navigate(`/trip-details/${item.id}`)}
                    />
                ))
            ) : (
                <Text className='text-center mt-5 text-purple-900 text-lg'>Nenhum destino encontrado.</Text>
            )}
        </SafeAreaView>
    );
}