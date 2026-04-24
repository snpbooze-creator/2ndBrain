import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View } from "react-native";
import { useFonts, PlayfairDisplay_400Regular, PlayfairDisplay_600SemiBold } from "@expo-google-fonts/playfair-display";
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from "@expo-google-fonts/inter";

import { RootNavigator } from "./src/navigation/RootNavigator";
import { AppProvider } from "./src/state/AppContext";
import { colors } from "./src/theme/tokens";

export default function App() {
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_600SemiBold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold
  });

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: colors.backgroundPrimary }} />;
  }

  return (
    <SafeAreaProvider>
      <AppProvider>
        <NavigationContainer>
          <StatusBar style="dark" backgroundColor={colors.backgroundPrimary} />
          <RootNavigator />
        </NavigationContainer>
      </AppProvider>
    </SafeAreaProvider>
  );
}
