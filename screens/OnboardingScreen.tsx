// filepath: d:\\sinais-app-certo\\sinais-app\\screens\\OnboardingScreen.tsx
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
  startButton: ViewStyle; // Added startButton to Styles interface
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

  const renderItem = ({ item, index }: { item: OnboardingSlide, index: number }) => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

    const iconTranslateY = scrollX.interpolate({
      inputRange,
      outputRange: [50, 0, -50],
      extrapolate: 'clamp',
    });

    const iconOpacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.3, 1, 0.3],
      extrapolate: 'clamp',
    });

    const titleScale = scrollX.interpolate({
      inputRange,
      outputRange: [0.8, 1, 0.8],
      extrapolate: 'clamp',
    });

    const titleOpacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.5, 1, 0.5],
      extrapolate: 'clamp',
    });

    const descriptionTranslateY = scrollX.interpolate({
      inputRange,
      outputRange: [30, 0, -30],
      extrapolate: 'clamp',
    });
    
    const descriptionOpacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.5, 1, 0.5],
      extrapolate: 'clamp',
    });

    return (
      <LinearGradient
        colors={['#F5F8FF', '#E0EAFC', '#D0E0F8']} // Subtle gradient change
        style={styles.slideContainer}
      >
        <View style={styles.slideContent}>
          <Animated.View style={[styles.iconContainer, { transform: [{ translateY: iconTranslateY }], opacity: iconOpacity }]}>
            <MaterialCommunityIcons name={item.iconName} size={80} color="#4A90E2" />
          </Animated.View>
          <Animated.Text style={[styles.title, { transform: [{ scale: titleScale }], opacity: titleOpacity }]}>{item.title}</Animated.Text>
          <Animated.Text style={[styles.description, { transform: [{ translateY: descriptionTranslateY }], opacity: descriptionOpacity }]}>{item.description}</Animated.Text>
        </View>
      </LinearGradient>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <FlatList
        data={slides}
        renderItem={renderItem}
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
            outputRange: [10, 25, 10], // Make active dot wider
            extrapolate: 'clamp',
          });
          
          const dotBackgroundColor = scrollX.interpolate({
            inputRange,
            outputRange: ['#AECBFA', '#4A90E2', '#AECBFA'], // Lighter color for inactive dots
            extrapolate: 'clamp',
          });
          
          return (
            <Animated.View 
              key={index} 
              style={[
                styles.paginationDot, 
                { width: dotWidth, backgroundColor: dotBackgroundColor } // Removed opacity, using color change
              ]} 
            />
          );
        })}
      </View>

      <SafeAreaView style={[styles.buttonContainer, { paddingBottom: insets.bottom > 0 ? insets.bottom : 30 }]}>
        <TouchableOpacity 
          style={styles.skipButton} 
          onPress={handleSkip}
        >
          <Text style={styles.skipButtonText}>Pular</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.nextButton, currentIndex === slides.length - 1 ? styles.startButton : {}]} 
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {currentIndex === slides.length - 1 ? 'Começar' : 'Próximo'}
          </Text>
          <MaterialCommunityIcons 
            name={currentIndex === slides.length - 1 ? 'check-circle-outline' : 'arrow-right-circle-outline'} 
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
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Slightly transparent white
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8, // Increased shadow
  },
  title: {
    fontSize: 28, // Slightly larger
    fontWeight: 'bold', // Bolder
    color: '#1A2E4C', // Darker blue
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#4A5C7A', // Softer dark blue
    textAlign: 'center',
    lineHeight: 26, // Increased line height
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 130, // Adjusted position
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationDot: {
    height: 10,
    borderRadius: 5,
    // backgroundColor is now animated
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
    paddingBottom: 30, // Default padding, will be overridden by insets if available
    paddingTop: 20,
    backgroundColor: 'transparent', // Ensure it's transparent for gradient to show
    borderTopWidth: 1, // Subtle separator
    borderTopColor: 'rgba(0,0,0,0.05)', // Light separator color
  },
  nextButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30, // More rounded
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10, // Increased gap
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    paddingVertical: 16, // Consistent padding
    paddingHorizontal: 20,
    borderRadius: 30, // More rounded
  },
  skipButtonText: {
    color: '#4A5C7A', // Softer dark blue
    fontSize: 16,
    fontWeight: '600', // Slightly bolder
  },
  startButton: { // Style for the "Começar" button
    backgroundColor: '#34D399', // A nice green color
    shadowColor: '#34D399',
  }
});