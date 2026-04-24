import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Folder, Home, Lightbulb, LineChart, UserRound } from "lucide-react-native";

import { BrainScreen } from "@/screens/BrainScreen";
import { HomeScreen } from "@/screens/HomeScreen";
import { ProfileScreen } from "@/screens/ProfileScreen";
import { ProjectDetailScreen } from "@/screens/ProjectDetailScreen";
import { ProjectsScreen } from "@/screens/ProjectsScreen";
import { ReviewScreen } from "@/screens/ReviewScreen";
import { SessionScreen } from "@/screens/SessionScreen";
import { colors, typography } from "@/theme/tokens";

import { MainTabParamList, RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.backgroundPrimary,
          borderTopColor: colors.subtleBorder,
          height: 80,
          paddingTop: 8,
          paddingBottom: 14
        },
        tabBarActiveTintColor: colors.textPrimary,
        tabBarInactiveTintColor: colors.mutedText,
        tabBarLabelStyle: {
          fontFamily: typography.sans,
          fontSize: 11
        },
        tabBarItemStyle: {
          outlineStyle: "none"
        } as object
      }}
    >
      <Tabs.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: ({ color }) => <Home size={21} color={color} /> }} />
      <Tabs.Screen name="Projects" component={ProjectsScreen} options={{ tabBarIcon: ({ color }) => <Folder size={21} color={color} /> }} />
      <Tabs.Screen name="Brain" component={BrainScreen} options={{ tabBarIcon: ({ color }) => <Lightbulb size={21} color={color} /> }} />
      <Tabs.Screen name="Review" component={ReviewScreen} options={{ tabBarIcon: ({ color }) => <LineChart size={21} color={color} /> }} />
      <Tabs.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: ({ color }) => <UserRound size={21} color={color} /> }} />
    </Tabs.Navigator>
  );
}

export function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.backgroundPrimary } }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="ProjectDetail" component={ProjectDetailScreen} />
      <Stack.Screen name="Session" component={SessionScreen} />
    </Stack.Navigator>
  );
}
