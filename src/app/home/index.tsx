import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

export default function Home() {
  return (
    <View className="flex-1 bg-blue-300 items-center justify-center">
      <StatusBar style="auto" />
    </View>
  );
}
