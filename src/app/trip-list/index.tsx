import { Search } from '@/components/search';
import { colors } from '@/styles/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Search as SearchIcon } from 'lucide-react-native';
import { View, Text } from 'react-native';
import { TripCard } from '@/components/trip-card';

export default function TripListScreen() {
    return (
        <SafeAreaView style={{ backgroundColor: colors.yellow[100], flex: 1, padding: 16, gap: 16 }}>
            <Search>
                <SearchIcon color={colors.zinc[400]} size={20} />
                <Search.Field
                    placeholder="Pesquisar por cidade ou país..."
                // editable={stepForm === StepForm.TRIP_DETAILS}
                // onChangeText={handleDestination}
                // value={destination}
                />
            </Search>

            <TripCard data={{ destination: 'Bahia, Brasil' , scheduleDate: '17 a 19 de Abr.'}} progress={1} />
            <TripCard data={{ destination: 'Curitiba, Brasil' , scheduleDate: '07 a 09 de Mai.'}} progress={0.7} />
            <TripCard data={{ destination: 'Bariloche, Argentina ' , scheduleDate: '17 a 19 de Out.'}}  progress={0.2} />


        </SafeAreaView>
    );
}