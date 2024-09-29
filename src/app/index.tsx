import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import {Ionicons} from '@expo/vector-icons'
import { colors } from '@/styles/colors';

import { verifyInstallation } from 'nativewind';
import Home from './home';

export default function Index() {

  verifyInstallation();

  return (
    <Home />
  );
}
