import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Splash = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        const parsedUserData = userData ? JSON.parse(userData) : null;

        // Minimum splash screen display time
        await new Promise(resolve => setTimeout(resolve, 2000));

        if (parsedUserData && parsedUserData.access_token) {
          // console.log('Access Token:', parsedUserData.access_token);
          navigation.navigate('Dashboard', { userData: parsedUserData });
        } else {
          navigation.navigate('Splesh1');
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        navigation.replace('Splash1');
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/Splashscreen.png')}
        style={styles.logoImage}
        resizeMode="cover"
      />
      {isLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  loaderContainer: {
    position: 'absolute',
    bottom: 50,
  },
});