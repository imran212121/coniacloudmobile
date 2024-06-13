import { Text, View } from 'react-native'
import React, { Component } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import Login from '../screen/auth/Login';
import Signup from '../screen/auth/Signup';
import Dashboard from '../screen/dashboard/Dashboard';
import Settings from '../screen/settings/Settings';
import BottomNavigation from './BottomNavigation';
import EditProfile from '../screen/settings/EditProfile';
import Splesh from '../screen/auth/Splesh';

const Stack = createNativeStackNavigator();
const StackNavigation = () => {
        return (
            <NavigationContainer>
                <Stack.Navigator initialRouteName='Splesh'>
                    <Stack.Screen options={{headerShown:false}} name='Splesh' component={Splesh} />
                    <Stack.Screen options={{headerShown:false}} name='Login' component={Login} />
                    <Stack.Screen options={{headerShown:false}} name='Signup' component={Signup} />
                    <Stack.Screen options={{headerShown:false}} name='Home' component={Dashboard} />
                    <Stack.Screen  options={{headerShown:false}} name='Settings' component={Settings} />
                    <Stack.Screen  options={{headerShown:false}} name='Dashboard' component={BottomNavigation} />
                    <Stack.Screen options={{headerShown:false}} name='Profile' component={EditProfile}/>
                </Stack.Navigator>
            </NavigationContainer>
        )
   
}

export default StackNavigation