import {
  Poppins_700Bold,
  Poppins_500Medium,
  Poppins_400Regular,
  Poppins_800ExtraBold
} from "@expo-google-fonts/poppins"

import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import Index from "@/app";

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
    Poppins_500Medium,
    Poppins_400Regular,
    Poppins_800ExtraBold
  })

  if (!fontsLoaded) return null;

  return (
    <>
      <StatusBar style="light" backgroundColor="transparent" translucent />
      <Index />
    </>
  );
}