import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect,useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';

const Splesh = () => {
    const navigation=useNavigation()

    useEffect(() => {
        const checkLoginStatus = async () => {
          try {
            const userData=await AsyncStorage.getItem('user')
            if (userData) {
              // User is logged in, navigate to HomeScreen
              navigation.navigate('Dashboard', { userData });
            } else {
            
              navigation.navigate('Login');
            }
          } catch (error) {
            console.error('Error checking login status:', error);

            navigation.navigate('Login');
          }
        };
    
        const timer = setTimeout(checkLoginStatus, 2000);
    
        return () => clearTimeout(timer);
      }, [navigation]);
      return (
    <View>
     <Image source={require('../../assets/Splashscreen.png')}
     style={styles.logoImage}/>
    </View>
  )
}

export default Splesh

const styles = StyleSheet.create({
    container:{
        flex:1,

    },
    logoImage:{
        height:'100%',width:'100%'
    }
})