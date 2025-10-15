import { createNativeStackNavigator, NativeStackHeaderProps } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet as RNStyleSheet, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';

// Importação do Header customizado
import Header from './components/Header';

// Importação das telas
import AIChatScreen from './screens/AIChatScreen';
import SplashScreen from "./screens/SplashScreen";
import OnboardingScreen from "./screens/OnboardingScreen";
import LoginScreen from "./screens/LoginScreen";
import MFAScreen from "./screens/MFAScreen";
import QuizIntroScreen from "./screens/QuizIntroScreen";
import QuizScreen from "./screens/QuizScreen";
import AlertScreen from "./screens/AlertScreen";
import EducationalScreen from "./screens/EducationalScreen";
import CirclesScreen from './screens/CirclesScreen';
import ProfileScreen from './screens/ProfileScreen';
import StatisticsScreen from "./screens/StatisticsScreen";
import BreathingScreen from "./screens/BreathingScreen";
import GoalsScreen from "./screens/GoalsScreen";
import CommunityScreen from "./screens/CommunityScreen";
import InsightsScreen from "./screens/InsightsScreen";
import CrisisModeScreen from "./screens/CrisisModeScreen";
import OpenFinanceScreen from "./screens/OpenFinanceScreen";
import WhyItMattersScreen from "./screens/WhyItMattersScreen";
import SettingsScreen from "./screens/SettingsScreen";
import MonitoringScreen from "./screens/MonitoringScreen";
import HomeScreen from "./screens/HomeScreen";
import DataControlScreen from "./screens/DataControlScreen";
import ExplanationAuditScreen from "./screens/ExplanationAuditScreen";
import BiasAnalysisScreen from "./screens/BiasAnalysisScreen";
import CybersecurityDemoScreen from "./screens/CybersecurityDemoScreen";
import CryptographyDemoScreen from "./screens/CryptographyDemoScreen";
import FaceRegistrationScreen from "./screens/FaceRegistrationScreen";
import FaceAuthenticationScreen from "./screens/FaceAuthenticationScreen";

// Telas de Diferenciais Demonstráveis
import AppBlockerScreen from "./screens/AppBlockerScreen";
import UsageAnalyticsScreen from "./screens/UsageAnalyticsScreen";
import FocusModeScreen from "./screens/FocusModeScreen";
import EmergencyModeScreen from "./screens/EmergencyModeScreen";
import GamificationScreen from "./screens/GamificationScreen";
import DashboardScreen from './screens/DashboardScreen';

// Tipos de Navegação
export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  MFA: { userId: string };
  QuizIntro: undefined;
  Quiz: undefined;
  MainTabs: undefined;
  Community: undefined;
  CybersecurityDemo: undefined;
  CryptographyDemo: undefined;
  FaceRegistration: {
    userId: string;
    riskProfile?: 'Conservador' | 'Moderado' | 'Impulsivo';
    score?: number;
  };
  FaceAuthentication: {
    email?: string;
  };
};

export type HomeStackParamList = {
  Home: undefined;
  WhyItMatters: undefined;
  Alert: undefined;
  CrisisMode: undefined;
  AIChat: undefined;
  AppBlocker: undefined;
  UsageAnalytics: undefined;
  FocusMode: undefined;
  EmergencyMode: undefined;
  Gamification: undefined;
};

export type MonitoringStackParamList = {
  Monitoring: undefined;
  Breathing: undefined;
  Statistics: undefined;
  Dashboards: undefined;
};

export type LearnStackParamList = {
  Educational: undefined;
  Insights: undefined;
};

export type GoalsStackParamList = {
  Goals: undefined;
  Insights: undefined;
};

export type CirclesStackParamList = {
  Circles: undefined;
};

export type ProfileStackParamList = {
  Profile: undefined;
  OpenFinance: undefined;
  Settings: undefined;
  DataControl: undefined;
  ExplanationAudit: undefined;
  BiasAnalysis: undefined;
  CrisisMode: undefined;
  FaceRegistration: {
    userId: string;
    riskProfile?: 'Conservador' | 'Moderado' | 'Impulsivo';
    score?: number;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

// Função de renderização do Header customizado
const CustomHeader = (props: NativeStackHeaderProps) => {
  const { options, navigation } = props;
  const title = options.title || props.route.name;
  return <Header title={title} canGoBack={navigation.canGoBack()} />;
};

// Stacks para cada aba
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ header: CustomHeader, headerShown: true }}>
      <HomeStack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <HomeStack.Screen name="WhyItMatters" component={WhyItMattersScreen} options={{ title: 'Por que isso importa?' }} />
      <HomeStack.Screen name="Alert" component={AlertScreen} options={{ title: 'Alertas' }} />
      <HomeStack.Screen name="CrisisMode" component={CrisisModeScreen} options={{ title: 'Modo Controle' }} />
      <HomeStack.Screen name="AppBlocker" component={AppBlockerScreen} options={{ title: 'Bloqueio de Apps' }} />
      <HomeStack.Screen name="UsageAnalytics" component={UsageAnalyticsScreen} options={{ title: 'Análise de Uso' }} />
      <HomeStack.Screen name="FocusMode" component={FocusModeScreen} options={{ title: 'Modo Foco' }} />
      <HomeStack.Screen name="EmergencyMode" component={EmergencyModeScreen} options={{ title: 'Modo Emergência' }} />
      <HomeStack.Screen name="Gamification" component={GamificationScreen} options={{ title: 'Conquistas' }} />
    </HomeStack.Navigator>
  );
}

const MonitoringStack = createNativeStackNavigator<MonitoringStackParamList>();
function MonitoringStackScreen() {
  return (
    <MonitoringStack.Navigator screenOptions={{ header: CustomHeader, headerShown: true }}>
      <MonitoringStack.Screen name="Monitoring" component={MonitoringScreen} options={{ title: 'Monitoramento' }} />
      <MonitoringStack.Screen name="Breathing" component={BreathingScreen} options={{ title: 'Respiração' }} />
      <MonitoringStack.Screen name="Statistics" component={StatisticsScreen} options={{ title: 'Estatísticas' }} />
      <MonitoringStack.Screen name="Dashboards" component={DashboardScreen} options={{ title: 'Dashboard' }} />
    </MonitoringStack.Navigator>
  );
}

const LearnStack = createNativeStackNavigator<LearnStackParamList>();
function LearnStackScreen() {
  return (
    <LearnStack.Navigator screenOptions={{ header: CustomHeader, headerShown: true }}>
      <LearnStack.Screen name="Educational" component={EducationalScreen} options={{ title: 'Aprender' }} />
      <LearnStack.Screen name="Insights" component={InsightsScreen} options={{ title: 'Insights IA' }} />
    </LearnStack.Navigator>
  );
}

const GoalsStack = createNativeStackNavigator<GoalsStackParamList>();
function GoalsStackScreen() {
  return (
    <GoalsStack.Navigator screenOptions={{ header: CustomHeader, headerShown: true }}>
      <GoalsStack.Screen name="Goals" component={GoalsScreen} options={{ title: 'Metas' }} />
      <GoalsStack.Screen name="Insights" component={InsightsScreen} options={{ title: 'Sugestões IA' }} />
    </GoalsStack.Navigator>
  );
}

const CirclesStack = createNativeStackNavigator<CirclesStackParamList>();
function CirclesStackScreen() {
  return (
    <CirclesStack.Navigator screenOptions={{ header: CustomHeader, headerShown: true }}>
      <CirclesStack.Screen name="Circles" component={CirclesScreen} options={{ title: 'SINAIS Circles' }} />
    </CirclesStack.Navigator>
  );
}

const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();
function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator screenOptions={{ header: CustomHeader, headerShown: true }}>
      <ProfileStack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
      <ProfileStack.Screen name="OpenFinance" component={OpenFinanceScreen} options={{ title: 'Open Finance' }} />
      <ProfileStack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Configurações' }} />
      <ProfileStack.Screen name="DataControl" component={DataControlScreen} options={{ title: 'Controle de Dados' }} />
      <ProfileStack.Screen name="ExplanationAudit" component={ExplanationAuditScreen} options={{ title: 'Auditoria de IA' }} />
      <ProfileStack.Screen name="BiasAnalysis" component={BiasAnalysisScreen} options={{ title: 'Análise de Viés' }} />
      <ProfileStack.Screen name="CrisisMode" component={CrisisModeScreen} options={{ title: 'Modo Controle' }} />
    </ProfileStack.Navigator>
  );
}

// Tab Navigator
function MainTabNavigator({ setShowChatButton }: { setShowChatButton: (show: boolean) => void }) {
  useEffect(() => {
    setShowChatButton(true);
    return () => setShowChatButton(false);
  }, [setShowChatButton]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#4A90E2',
        tabBarInactiveTintColor: '#A0AEC0',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof MaterialCommunityIcons.glyphMap = 'help-circle-outline';
          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'MonitoringTab') {
            iconName = focused ? 'chart-line' : 'chart-line';
          } else if (route.name === 'LearnTab') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'GoalsTab') {
            iconName = focused ? 'flag-checkered' : 'flag-variant-outline';
          } else if (route.name === 'CirclesTab') {
            iconName = focused ? 'earth' : 'earth';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'account' : 'account-outline';
          }
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarStyle: { height: 65, paddingBottom: 8, paddingTop: 8 },
        tabBarLabelStyle: { fontSize: 11 },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStackScreen} options={{ tabBarLabel: 'Início' }} />
      <Tab.Screen name="MonitoringTab" component={MonitoringStackScreen} options={{ tabBarLabel: 'Monitor' }} />
      <Tab.Screen name="LearnTab" component={LearnStackScreen} options={{ tabBarLabel: 'Aprender' }} />
      <Tab.Screen name="GoalsTab" component={GoalsStackScreen} options={{ tabBarLabel: 'Metas' }} />
      <Tab.Screen name="CirclesTab" component={CirclesStackScreen} options={{ tabBarLabel: 'Circles' }} />
      <Tab.Screen name="ProfileTab" component={ProfileStackScreen} options={{ tabBarLabel: 'Perfil' }} />
    </Tab.Navigator>
  );
}

// Root Stack
export default function App() {
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [showChatButton, setShowChatButton] = useState(false);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="MFA" component={MFAScreen} options={{ headerShown: true, header: CustomHeader, title: 'Verificação MFA' }} />
        <Stack.Screen name="QuizIntro" component={QuizIntroScreen} options={{ headerShown: true, header: CustomHeader, title: 'Quiz de Perfil' }} />
        <Stack.Screen name="Quiz" component={QuizScreen} options={{ headerShown: true, header: CustomHeader, title: 'Quiz' }} />
        <Stack.Screen name="MainTabs">
          {() => <MainTabNavigator setShowChatButton={setShowChatButton} />}
        </Stack.Screen>
        <Stack.Screen name="Community" component={CommunityScreen} options={{ headerShown: true, header: CustomHeader, title: 'Comunidade' }} />
        <Stack.Screen name="CybersecurityDemo" component={CybersecurityDemoScreen} options={{ headerShown: true, header: CustomHeader, title: 'Demo Cybersecurity' }} />
        <Stack.Screen name="CryptographyDemo" component={CryptographyDemoScreen} options={{ headerShown: true, header: CustomHeader, title: 'Demo Criptografia' }} />
        <Stack.Screen name="FaceRegistration" component={FaceRegistrationScreen} options={{ headerShown: false }} />
        <Stack.Screen name="FaceAuthentication" component={FaceAuthenticationScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
      {showChatButton && (
        <>
          <TouchableOpacity style={styles.chatButton} onPress={() => setIsChatVisible(true)}>
            <Text style={styles.chatButtonText}>AI</Text>
          </TouchableOpacity>
          <AIChatScreen visible={isChatVisible} onClose={() => setIsChatVisible(false)} />
        </>
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  chatButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: '#007AFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  chatButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});