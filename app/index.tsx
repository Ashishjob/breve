import React, { useEffect } from 'react';
import { Image, View, Text, StyleSheet, Dimensions, Animated } from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const BreveSplashScreen = () => {
  const router = useRouter();
  const moveAnim = new Animated.Value(-width);
  const rotateAnim = new Animated.Value(0);

  useEffect(() => {
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
      setTimeout(() => {
        router.replace('/');
      }, 500);
    });
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 4],
    outputRange: ['0deg', '1440deg']
  });

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
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
      </View>
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
});

export default BreveSplashScreen;