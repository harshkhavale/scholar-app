import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { router, Stack, useNavigation } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import "../global.css";
import { useColorScheme } from "@/hooks/useColorScheme";
import { StatusBar } from "expo-status-bar"; // Import StatusBar
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { useAuthStore } from "@/store/auth-store";
import { StripeProvider } from "@stripe/stripe-react-native";
import { toastConfig } from "@/utils/toast-config";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
const queryClient = new QueryClient();

export default function RootLayout() {
  const user = useAuthStore((state) => state.user);

  const colorScheme = useColorScheme();

  // Load custom font
  const [loaded] = useFonts({
    Font: require("../assets/fonts/geist.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <StripeProvider publishableKey="pk_test_51NjvWuSBPcBJMasLnoEBEg0vlMIyHnY45klxTnGgWqmKwb64ccK0vaL5BdJxLBuKRQh8jnkxxfpfooPxpFBaK56G00L8Nb0e10">
      <QueryClientProvider client={queryClient}>
        <Toast config={toastConfig} />

        {/* StatusBar for visibility */}
        <StatusBar style={colorScheme === "light" ? "dark" : "light"} />

        <ThemeProvider
          value={colorScheme === "light" ? DefaultTheme : DarkTheme}
        >
          <Stack
            screenOptions={{
              headerShown: false, // default setting for all screens
            }}
          >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen
              name="course-detail"
              options={{ headerShown: true, title: "" }}
            />
            <Stack.Screen
              name="educator-detail"
              options={{ headerShown: true, title: "" }}
            />
            <Stack.Screen
              name="(module)/modules"
              options={{ headerShown: false, title: "" }}
            />
            <Stack.Screen
              name="module-detail"
              options={{ headerShown: true, title: "" }}
            />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen
              name="(auth)/register"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="(auth)/login"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="role" options={{ headerShown: false }} />
            <Stack.Screen
              name="(course)/create-course"
              options={{
                headerShown: true,
                title: "Create a New Course",
                headerTitleStyle: {
                  fontFamily: "Font",
                  fontWeight: "semibold", // Set your custom font here
                },
              }}
            />
            <Stack.Screen
              name="(module)/create-module"
              options={{
                headerShown: false,
                title: "Create a New Module",
                headerTitleStyle: {
                  fontFamily: "Font",
                  fontWeight: "semibold", // Set your custom font here
                },
              }}
            />
            <Stack.Screen name="+not-found" />
          </Stack>
        </ThemeProvider>
      </QueryClientProvider>
    </StripeProvider>
  );
}
