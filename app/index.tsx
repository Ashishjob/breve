import React, { useEffect, useState } from 'react';
import { Image, View, Text, StyleSheet, Dimensions, Animated, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { initializeApp } from 'firebase/app';
import { 
  User,
  getAuth, 
  GoogleAuthProvider, 
  signInWithCredential,
  onAuthStateChanged 
} from 'firebase/auth';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBwlqjFN1hza73m3uCA5oZHBc-KbK84Wuw",
  authDomain: "breve-f8952.firebaseapp.com",
  projectId: "breve-f8952",
  storageBucket: "breve-f8952.firebasestorage.app",
  messagingSenderId: "9179197035",
  appId: "1:9179197035:web:5ef06a064992369f6fcb2e",
  measurementId: "G-ZCGDW43QGM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

WebBrowser.maybeCompleteAuthSession();

// Configure Google Sign In
GoogleSignin.configure({
  webClientId: '9179197035-n0u7ja0ghldlmqrmvvvsvp1ulata5cji.apps.googleusercontent.com',
  iosClientId: '9179197035-2d690dvc1q21aspk76vinim8hpetc5ki.apps.googleusercontent.com',
  offlineAccess: true
});

const { width, height } = Dimensions.get('window');

const BreveSplashScreen = () => {
  const router = useRouter();
  
  const [user, setUser] = useState<User | null>(null);
  const moveAnim = new Animated.Value(-width);
  const rotateAnim = new Animated.Value(0);
  const slideUpAnim = new Animated.Value(0);
  const fadeInAnim = new Animated.Value(0);
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    // Check for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        router.replace('/home');
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Initial rolling animation
    Animated.parallel([
      Animated.timing(moveAnim, {
        toValue: 0,
        duration: 3000,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 4,
        duration: 3000,
        useNativeDriver: true,
      })
    ]).start(() => {
      setShowButtons(true);
      Animated.parallel([
        Animated.timing(slideUpAnim, {
          toValue: -height * 0.15,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(fadeInAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        })
      ]).start();
    });
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 4],
    outputRange: ['0deg', '1440deg']
  });

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      
      // Sign out first to ensure clean state
      await GoogleSignin.signOut();
      
      // Start the sign in flow
      const userInfo = await GoogleSignin.signIn();
      console.log("Google Sign In Success", userInfo);
  
      // Get the tokens
      const { idToken } = userInfo;
      if (!idToken) {
        throw new Error('No ID token present!');
      }
  
      // Create a Google credential with the token
      const googleCredential = GoogleAuthProvider.credential(idToken);
  
      // Sign in with Firebase using the credential
      const userCredential = await signInWithCredential(auth, googleCredential);
      console.log("Firebase Sign In Success", userCredential.user);
  
    } catch (error: any) {
      console.error("Sign In Error", error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('Sign In Cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('Sign In Already in Progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Play Services Not Available');
      } else {
        Alert.alert('Sign In Error', error.message);
      }
    }
  };

  const handleEmailSignIn = () => {
    router.push('/auth/email-signin');
  };

  const handleSignUp = () => {
    router.push('/auth/email-signin');
  };

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.logoContainer,
          {
            transform: [{ translateY: slideUpAnim }]
          }
        ]}
      >
        <View style={styles.iconTextContainer}>
          <Animated.View 
            style={{ 
              transform: [
                { translateX: moveAnim },
                { rotate: spin }
              ] 
            }}
          >
            <Image
              source={require('@/assets/images/logo.svg')}
              style={styles.reactLogo}
            />
          </Animated.View>
          <Text style={styles.logoText}>breve</Text>
        </View>
      </Animated.View>

      {showButtons && (
        <Animated.View 
          style={[
            styles.buttonContainer,
            {
              opacity: fadeInAnim,
              transform: [{ translateY: fadeInAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0]
              })}]
            }
          ]}
        >
          <TouchableOpacity 
            style={[styles.button, styles.googleButton]}
            onPress={handleGoogleSignIn}
          >
            <Text style={styles.buttonText}>Login with Google</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.emailButton]}
            onPress={handleEmailSignIn}
          >
            <Text style={[styles.buttonText, { color: '#ffffff' }]}>Login with Email</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.signUpButton}
            onPress={handleSignUp}
          >
            <Text style={styles.signUpText}>Don't have an account? Sign up</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D3B59C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    position: 'absolute',
    top: '30%',  // Changed from center to allow space for buttons
    alignItems: 'center',
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoText: {
    fontSize: 48,
    fontFamily: 'AveriaSerifLibre-Bold',
    color: '#000000',
  },
  reactLogo: {
    width: 50,
    height: 50,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: '20%',  // Changed from height calculation
    width: '80%',
    gap: 16,
    zIndex: 1,  // Added to ensure buttons are above other elements
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 12,  // Added spacing between buttons
  },
  googleButton: {
    backgroundColor: '#ffffff',
  },
  emailButton: {
    backgroundColor: '#4A2B1C',
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'AveriaSerifLibre-Bold',
    color: '#000000',
  },
  signUpButton: {
    marginTop: 8,
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 14,
    fontFamily: 'AveriaSerifLibre-Regular',
    color: '#4A2B1C',
    textDecorationLine: 'underline',
  },
});

export default BreveSplashScreen;