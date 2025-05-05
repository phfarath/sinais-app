import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context"
import { Toaster } from 'sonner-native';
import SplashScreen from "./screens/SplashScreen"
import OnboardingScreen from "./screens/OnboardingScreen"
import LoginScreen from "./screens/LoginScreen"
import QuizIntroScreen from "./screens/QuizIntroScreen"
import QuizScreen from "./screens/QuizScreen"
import DashboardScreen from "./screens/DashboardScreen"
import AlertScreen from "./screens/AlertScreen"
import EducationalScreen from "./screens/EducationalScreen"
import HelpScreen from "./screens/HelpScreen"
import ProfileScreen from "./screens/ProfileScreen"
import StatisticsScreen from "./screens/StatisticsScreen"
import BreathingScreen from "./screens/BreathingScreen"
import GoalsScreen from "./screens/GoalsScreen"
import CommunityScreen from "./screens/CommunityScreen"
import InsightsScreen from "./screens/InsightsScreen"
import CrisisModeScreen from "./screens/CrisisModeScreen"
import OpenFinanceScreen from "./screens/OpenFinanceScreen"
import WhyItMattersScreen from "./screens/WhyItMattersScreen"
import SettingsScreen from "./screens/SettingsScreen"

// Definindo o tipo dos parâmetros para a navegação
export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  QuizIntro: undefined;
  Quiz: undefined;
  Dashboard: { riskProfile?: string };
  Alert: undefined;
  Educational: undefined;
  Help: undefined;
  Profile: undefined;
  Statistics: undefined;
  Breathing: undefined;
  Goals: undefined;
  Community: undefined;
  Insights: undefined;
  CrisisMode: undefined;
  OpenFinance: undefined;
  WhyItMatters: undefined;
  Settings: undefined;
};

// Criando o Stack Navigator com os tipos definidos
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#F5F8FF' },
        headerTintColor: '#4A90E2',
        headerShadowVisible: false,
        headerBackTitle: 'Voltar',
      }}>
      <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="QuizIntro" component={QuizIntroScreen} />
      <Stack.Screen name="Quiz" component={QuizScreen} />
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="Alert" component={AlertScreen} />
      <Stack.Screen name="Educational" component={EducationalScreen} />
      <Stack.Screen name="Help" component={HelpScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Statistics" component={StatisticsScreen} />
      <Stack.Screen name="Breathing" component={BreathingScreen} />
      <Stack.Screen name="Goals" component={GoalsScreen} />
      <Stack.Screen name="Community" component={CommunityScreen} />
      <Stack.Screen name="Insights" component={InsightsScreen} />
      <Stack.Screen name="CrisisMode" component={CrisisModeScreen} />
      <Stack.Screen name="OpenFinance" component={OpenFinanceScreen} />
      <Stack.Screen name="WhyItMatters" component={WhyItMattersScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider style={styles.container}>
      <Toaster />
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    userSelect: "none"
  }
});