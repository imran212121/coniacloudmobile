import React, { Component, useState, useEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import Login from '../screen/auth/Login';
import Signup from '../screen/auth/Signup';
import Dashboard from '../screen/dashboard/Dashboard';
import Settings from '../screen/settings/Settings';
import BottomNavigation from './BottomNavigation';
import EditProfile from '../screen/settings/EditProfile';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Splesh from '../screen/auth/Splesh';
import UploadDoc from '../screen/dashboard/UploadDoc';
const Stack = createNativeStackNavigator();
const StackNavigation = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = JSON.parse(await AsyncStorage.getItem('user'))
      setIsLoggedIn(!!token);
    };
    checkLoginStatus();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isLoggedIn ? 'Home':'Splesh'}>
      {/* <Stack.Navigator initialRouteName={ 'Home'}> */}
      <Stack.Screen options={{headerShown:false}} name='Splesh' component={Splesh} />
       
          <Stack.Screen options={{ headerShown: false }} name='Home' component={BottomNavigation} />
          <Stack.Screen options={{ headerShown: false }} name='Login' component={Login} />
       

        <Stack.Screen options={{ headerShown: false }} name='Signup' component={Signup} />

        <Stack.Screen options={{ headerShown: false }} name='Settings' component={Settings} />
        <Stack.Screen options={{ headerShown: false }} name='Dashboard' component={BottomNavigation} />
        <Stack.Screen options={{ headerShown: false }} name='Profile' component={EditProfile} />
        <Stack.Screen options={{ headerShown: false }} name='UploadDoc' component={UploadDoc} />
      </Stack.Navigator>
    </NavigationContainer>
  )

}

export default StackNavigation