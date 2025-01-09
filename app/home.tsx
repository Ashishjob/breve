import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  const auth = getAuth();

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      router.replace('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome!</Text>
      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D3B59C',
  },
  welcomeText: {
    fontSize: 24,
    marginBottom: 20,
    fontFamily: 'AveriaSerifLibre-Bold',
  },
  button: {
    backgroundColor: '#4A2B1C',
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'AveriaSerifLibre-Bold',
  },
});