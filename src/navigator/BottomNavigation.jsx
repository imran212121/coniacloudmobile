import { StyleSheet, Image } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Dashboard from '../screen/dashboard/Dashboard';
import DashboardStarted from '../screen/dashboard/DashboardStarted';
import DashboardShare from '../screen/dashboard/DashboardShare';
import DashboardTrash from '../screen/dashboard/DashboardTrash';


const Tab = createBottomTabNavigator();

const BottomNavigation = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name='My Drive'
        component={Dashboard}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              style={{
                width: 25,
                height: 25,
                tintColor: focused ? '#007bff' : '#414a4c' // Blue when focused, gray otherwise
              }}
              source={
                focused
                  ? require('../assets/icons/drive.png') // Adjust image path and format if necessary
                  : require('../assets/icons/drive.png')
              }
            />
          )
        }}
      />
      <Tab.Screen
        name='Started'
        component={DashboardStarted}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              style={{
                width: 20,
                height: 20,
                tintColor: focused ? '#007bff' : '#414a4c' // Blue when focused, gray otherwise
              }}
              source={
                focused
                  ? require('../assets/icons/started.png') // Adjust image path and format if necessary
                  : require('../assets/icons/started.png')
              }
            />
          )
        }}
      />
       <Tab.Screen
        name='Shared'
        component={DashboardShare}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              style={{
                width: 20,
                height: 20,
                tintColor: focused ? '#007bff' : '#414a4c' // Blue when focused, gray otherwise
              }}
              source={
                focused
                  ? require('../assets/icons/share.png') // Adjust image path and format if necessary
                  : require('../assets/icons/share.png')
              }
            />
          )
        }}
      />
      <Tab.Screen
        name='Trash'
        component={DashboardTrash}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              style={{
                width: 20,
                height: 20,
                tintColor: focused ? '#007bff' : '#414a4c' // Blue when focused, gray otherwise
              }}
              source={
                focused
                  ? require('../assets/icons/trash.png') // Adjust image path and format if necessary
                  : require('../assets/icons/trash.png')
              }
            />
          )
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNavigation;

const styles = StyleSheet.create({});
