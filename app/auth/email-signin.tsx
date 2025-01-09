import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'expo-router';

export default function EmailSignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const auth = getAuth();

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      router.replace('/');
    } catch (error) {
      Alert.alert('Error', (error as Error).message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#D3B59C',
    justifyContent: 'center',
  },
  input: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#4A2B1C',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'AveriaSerifLibre-Bold',
  },
});