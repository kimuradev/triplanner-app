import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import {Ionicons} from '@expo/vector-icons'
import { colors } from '@/styles/colors';

import { verifyInstallation } from 'nativewind';


export default function Home() {

  verifyInstallation();

  return (
    <View className="flex-1 bg-blue-300 items-center justify-center">
    <Ionicons name="logo-markdown" size={32} color={colors.white} />
      <Text className="text-white font-bold">Market Share</Text>
      <StatusBar style="auto" />
    </View>
  );
}
