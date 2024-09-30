import {
  PlusJakartaSans_700Bold,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_800ExtraBold
} from "@expo-google-fonts/plus-jakarta-sans"

import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import Home from "./home";

export default function Screen() {
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_700Bold,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_800ExtraBold
  })

  if (!fontsLoaded) return null;

  return (
    <>
      <StatusBar style="light" backgroundColor="transparent" translucent />
      <Home />
    </>
  );
}