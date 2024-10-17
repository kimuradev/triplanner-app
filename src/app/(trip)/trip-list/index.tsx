import { FlatList, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Search as SearchIcon } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/styles/colors';
import { Search } from '@/components/search';
import { TripCard } from '@/components/trip-card';

import { useTripList } from './useTripList';

export default function TripListScreen() {
    const { t } = useTranslation();
    const {
        data,
        searchDestination,
        calculateProgress,
        handleDestination
    } = useTripList();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFCE4', paddingHorizontal: 16 }} edges={['right', 'left', 'top']} >
            <View className='mt-8 mb-4'>
                <Search>
                    <SearchIcon color={colors.zinc[400]} size={20} />
                    <Search.Field
                        placeholder={t('tripList.search')}
                        onChangeText={handleDestination}
                        value={searchDestination}
                    />
                </Search>
            </View>
            <View className='flex-1'>
                {data.length > 0 ? (
                    <FlatList
                        className='p-0 m-0'
                        data={data}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => <TripCard
                            key={item.id}
                            data={{ destination: item.destination, scheduleDate: item.scheduleDate, activities: item.activities }}
                            progress={calculateProgress({ activities: item.activities })}
                            handlePress={() => router.navigate(`/trip-details/${item.id}`)}
                        />}
                        contentContainerClassName="gap-4"
                    />
                ) : (
                    <Text className='text-center mt-5 text-purple-900 text-lg'>{t('tripList.destinationNotFound')}</Text>
                )}
            </View>
        </SafeAreaView>
    );
}