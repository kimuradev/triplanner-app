import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';

export default function Home() {
  return (
    <View className="flex-1 bg-yellow100 items-center justify-center">
      <StatusBar style="auto" />
      <Text>Home</Text>
    </View>
  );
}
