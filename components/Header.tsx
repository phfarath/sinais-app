import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

type HeaderProps = {
  title: string;
  canGoBack?: boolean;
};

const Header = ({ title, canGoBack }: HeaderProps) => {
  const navigation = useNavigation();

  return (
    <View style={styles.headerContainer}>
      {canGoBack && (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#4A90E2" />
        </TouchableOpacity>
      )}
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#F5F8FF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    height: 60,
  },
  backButton: {
    position: 'absolute',
    left: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
});

export default Header;