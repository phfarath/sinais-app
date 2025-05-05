// filepath: d:\sinais-app-certo\sinais-app\screens\OnboardingScreen.tsx
import { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, TextStyle, FlatList, Dimensions, Animated } from 'react-native';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';

type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
};

type OnboardingScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;
};

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  image: string;
  iconName: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
}

interface Styles {
  container: ViewStyle;
  slideContainer: ViewStyle;
  slideContent: ViewStyle;
  iconContainer: ViewStyle;
  title: TextStyle;
  description: TextStyle;
  paginationContainer: ViewStyle;
  paginationDot: ViewStyle;
  buttonContainer: ViewStyle;
  nextButton: ViewStyle;
  nextButtonText: TextStyle;
  skipButton: ViewStyle;
  skipButtonText: TextStyle;
}

const { width } = Dimensions.get('window');

const slides: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Bem-vindo ao SINAIS',
    description: 'Nossa missão é promover um jogo mais consciente e saudável, ajudando você a identificar comportamentos de risco.',
    image: 'mission',
    iconName: 'brain',
  },
  {
    id: '2',
    title: 'Sua Privacidade é Prioridade',
    description: 'Seus dados são protegidos e confidenciais. Você tem controle total sobre o que compartilha conosco.',
    image: 'privacy',
    iconName: 'shield-lock',
  },
  {
    id: '3',
    title: 'Suporte Quando Precisar',
    description: 'Oferecemos ferramentas e recursos para ajudar você a manter hábitos saudáveis e buscar apoio quando necessário.',
    image: 'support',
    iconName: 'hand-heart',
  }
];

export default function OnboardingScreen({ navigation }: OnboardingScreenProps) {
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      navigation.navigate('Login');
    }
  };

  const handleSkip = () => {
    navigation.navigate('Login');
  };

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <FlatList
        data={slides}
        renderItem={({ item }) => (
          <LinearGradient
            colors={['#F5F8FF', '#EFF6FF']}
            style={styles.slideContainer}
          >
            <View style={styles.slideContent}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name={item.iconName} size={80} color="#4A90E2" />
              </View>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </LinearGradient>
        )}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        ref={flatListRef}
      />

      <View style={styles.paginationContainer}>
        {slides.map((_, index) => {
          const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
          
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [10, 20, 10],
            extrapolate: 'clamp',
          });
          
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });
          
          return (
            <Animated.View 
              key={index} 
              style={[
                styles.paginationDot, 
                { width: dotWidth, opacity }
              ]} 
            />
          );
        })}
      </View>

      <SafeAreaView style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.skipButton} 
          onPress={handleSkip}
        >
          <Text style={styles.skipButtonText}>Pular</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.nextButton} 
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {currentIndex === slides.length - 1 ? 'Começar' : 'Próximo'}
          </Text>
          <MaterialCommunityIcons 
            name={currentIndex === slides.length - 1 ? 'check' : 'arrow-right'} 
            size={20} 
            color="#FFFFFF" 
          />
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: '#F5F8FF',
  },
  slideContainer: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  slideContent: {
    alignItems: 'center',
    maxWidth: '80%',
    paddingVertical: 40,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 120,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationDot: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4A90E2',
    marginHorizontal: 8,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 20,
    backgroundColor: 'transparent',
  },
  nextButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    padding: 16,
  },
  skipButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '500',
  },
});