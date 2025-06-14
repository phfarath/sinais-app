import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context"
import { Toaster } from 'sonner-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Importação das telas
import SplashScreen from "./screens/SplashScreen"
import OnboardingScreen from "./screens/OnboardingScreen"
import LoginScreen from "./screens/LoginScreen"
import MFAScreen from "./screens/MFAScreen"
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
import MonitoringScreen from "./screens/MonitoringScreen"
import HomeScreen from "./screens/HomeScreen"

// Telas de Cybersecurity
import DataControlScreen from "./screens/DataControlScreen"
import ExplanationAuditScreen from "./screens/ExplanationAuditScreen"
import BiasAnalysisScreen from "./screens/BiasAnalysisScreen"
import CybersecurityDemoScreen from "./screens/CybersecurityDemoScreen"
import CryptographyDemoScreen from "./screens/CryptographyDemoScreen"

// Definindo o tipo dos parâmetros para a navegação
export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  MFA: { userId: string; method?: 'sms' | 'email' | 'authenticator' };
  QuizIntro: undefined;
  Quiz: undefined;
  MainTabs: undefined;
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
  Monitoring: undefined;
  Home: undefined;
  DataControl: undefined;
  ExplanationAudit: undefined;
  BiasAnalysis: undefined;
  CybersecurityDemo: undefined;
  CryptographyDemo: undefined;
};

// Tipos para os navigators de tabs
export type HomeStackParamList = {
  Home: undefined;
  WhyItMatters: undefined;
  Alert: undefined;
  CrisisMode: undefined;
};

export type MonitoringStackParamList = {
  Monitoring: undefined;
  Breathing: undefined;
  Statistics: undefined;
};

export type LearnStackParamList = {
  Educational: undefined;
  Insights: undefined;
};

export type GoalsStackParamList = {
  Goals: undefined;
  Insights: undefined;
};

export type ProfileStackParamList = {
  Profile: undefined;
  OpenFinance: undefined;
  Settings: undefined;
  CrisisMode: undefined;
  DataControl: undefined;
  ExplanationAudit: undefined;
  BiasAnalysis: undefined;
};

// Criando o Stack Navigator com os tipos definidos
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

// Stacks individuais para cada tab
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const MonitoringStack = createNativeStackNavigator<MonitoringStackParamList>();
const LearnStack = createNativeStackNavigator<LearnStackParamList>();
const GoalsStack = createNativeStackNavigator<GoalsStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

// Stack Navigator para a aba Início
function HomeStackScreen() {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#F5F8FF' },
        headerTintColor: '#4A90E2',
        headerShadowVisible: false,
        headerBackTitle: 'Voltar',
      }}>
      <HomeStack.Screen name="Home" component={HomeScreen} options={{ title: 'Início' }} />
      <HomeStack.Screen name="WhyItMatters" component={WhyItMattersScreen} options={{ title: 'Por que isso importa?' }} />
      <HomeStack.Screen name="Alert" component={AlertScreen} options={{ title: 'Alertas' }} />
      <HomeStack.Screen name="CrisisMode" component={CrisisModeScreen} options={{ title: 'Modo Controle' }} />
    </HomeStack.Navigator>
  );
}

// Stack Navigator para a aba Monitoramento
function MonitoringStackScreen() {
  return (
    <MonitoringStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#F5F8FF' },
        headerTintColor: '#4A90E2',
        headerShadowVisible: false,
        headerBackTitle: 'Voltar',
      }}>
      <MonitoringStack.Screen name="Monitoring" component={MonitoringScreen} options={{ title: 'Monitoramento' }} />
      <MonitoringStack.Screen name="Breathing" component={BreathingScreen} options={{ title: 'Respiração' }} />
      <MonitoringStack.Screen name="Statistics" component={StatisticsScreen} options={{ title: 'Estatísticas' }} />
    </MonitoringStack.Navigator>
  );
}

// Stack Navigator para a aba Aprender
function LearnStackScreen() {
  return (
    <LearnStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#F5F8FF' },
        headerTintColor: '#4A90E2',
        headerShadowVisible: false,
        headerBackTitle: 'Voltar',
      }}>
      <LearnStack.Screen name="Educational" component={EducationalScreen} options={{ title: 'Aprender' }} />
      <LearnStack.Screen name="Insights" component={InsightsScreen} options={{ title: 'Insights IA' }} />
    </LearnStack.Navigator>
  );
}

// Stack Navigator para a aba Metas
function GoalsStackScreen() {
  return (
    <GoalsStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#F5F8FF' },
        headerTintColor: '#4A90E2',
        headerShadowVisible: false,
        headerBackTitle: 'Voltar',
      }}>
      <GoalsStack.Screen name="Goals" component={GoalsScreen} options={{ title: 'Metas' }} />
      <GoalsStack.Screen name="Insights" component={InsightsScreen} options={{ title: 'Sugestões IA' }} />
    </GoalsStack.Navigator>
  );
}

// Stack Navigator para a aba Perfil
function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#F5F8FF' },
        headerTintColor: '#4A90E2',
        headerShadowVisible: false,
        headerBackTitle: 'Voltar',
      }}>
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

// Tab Navigator principal com as 5 abas
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof MaterialCommunityIcons.glyphMap;

          switch (route.name) {
            case 'HomeTab':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'MonitoringTab':
              iconName = focused ? 'chart-line' : 'chart-line';
              break;
            case 'LearnTab':
              iconName = focused ? 'book' : 'book-outline';
              break;
            case 'GoalsTab':
              iconName = focused ? 'target' : 'target';
              break;
            case 'ProfileTab':
              iconName = focused ? 'account' : 'account-outline';
              break;
            default:
              iconName = 'help-circle-outline';
          }

          // Aumentando o tamanho do ícone para melhor visualização
          return <MaterialCommunityIcons name={iconName} size={focused ? size + 4 : size} color={color} />;
        },
        tabBarActiveTintColor: '#4A90E2',
        tabBarInactiveTintColor: '#A0AEC0',
        headerShown: false,
        tabBarStyle: {
          paddingBottom: 8,
          paddingTop: 8,
          height: 65,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 6,
          elevation: 8,
        },
        tabBarItemStyle: {
          // Adicionando estilo para os itens individuais
          paddingVertical: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: 4,
        },
        // Adicionando um estilo personalizado para a aba ativa
        tabBarActiveBackgroundColor: 'rgba(74, 144, 226, 0.08)',
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeStackScreen} 
        options={{ 
          tabBarLabel: 'Início',
          tabBarBadge: undefined // Remover comentário se precisar de notificações/badges
        }}
      />
      <Tab.Screen 
        name="MonitoringTab" 
        component={MonitoringStackScreen} 
        options={{ tabBarLabel: 'Monitoramento' }}
      />
      <Tab.Screen 
        name="LearnTab" 
        component={LearnStackScreen} 
        options={{ tabBarLabel: 'Aprender' }}
      />
      <Tab.Screen 
        name="GoalsTab" 
        component={GoalsStackScreen} 
        options={{ tabBarLabel: 'Metas' }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileStackScreen} 
        options={{ tabBarLabel: 'Perfil' }}
      />
    </Tab.Navigator>
  );
}

// Stack Navigator principal
function RootStack() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="MFA" component={MFAScreen} options={{ headerShown: true, title: 'Verificação MFA' }} />
      <Stack.Screen name="QuizIntro" component={QuizIntroScreen} options={{ headerShown: true }} />
      <Stack.Screen name="Quiz" component={QuizScreen} options={{ headerShown: true }} />
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen name="Community" component={CommunityScreen} options={{ headerShown: true }} />
      <Stack.Screen name="DataControl" component={DataControlScreen} options={{ headerShown: true, title: 'Controle de Dados' }} />
      <Stack.Screen name="ExplanationAudit" component={ExplanationAuditScreen} options={{ headerShown: true, title: 'Auditoria de IA' }} />
      <Stack.Screen name="BiasAnalysis" component={BiasAnalysisScreen} options={{ headerShown: true, title: 'Análise de Viés' }} />
      <Stack.Screen name="CybersecurityDemo" component={CybersecurityDemoScreen} options={{ headerShown: true, title: 'Demo Cybersecurity' }} />
      <Stack.Screen name="CryptographyDemo" component={CryptographyDemoScreen} options={{ headerShown: true, title: 'Demo Criptografia' }} />
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