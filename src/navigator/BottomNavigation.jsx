import { StyleSheet, Text, Image, View } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Dashboard from '../screen/dashboard/Dashboard';
import DashboardStarted from '../screen/dashboard/DashboardStarted';
import DashboardShare from '../screen/dashboard/DashboardShare';
import DashboardTrash from '../screen/dashboard/DashboardTrash';
import UserProfile from '../screen/dashboard/UserProfile';


const Tab = createBottomTabNavigator();

const BottomNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff', // Default tab bar background color
          height: 70,
          paddingBottom: 5,
          paddingHorizontal:15
        
        },
        tabBarShowLabel: false, // Hide default label
        tabBarIcon: ({ focused }) => {
          let iconName;
          let label;
          let iconSize = 20;

          switch (route.name) {
            case 'My Drive':
              iconName = require('../assets/icons/home.png');
              label = 'Home';
              iconSize = 20;
              break;
              case 'MyFiles':
              iconName = require('../assets/icons/AddDoc.png');
              label = 'MyFiles';
              break;
            case 'Shared':
              iconName = require('../assets/icons/Users.png');
              label = 'Shared';
              break;
            case 'Settings':
              iconName = require('../assets/icons/setting.png');
              label = 'Setting';
              break;
              case 'User':
                iconName = require('../assets/icons/user.png');
                label = 'User';
                break;
            default:
              break;
          }

          return (
            <View style={[styles.tabItem, focused && styles.tabItemFocused]}>
              <Image
                style={{
                  width: iconSize,
                  height: iconSize,
                  tintColor: focused ? '#007bff' : '#414a4c'  // White when focused, gray otherwise
                }}
                source={iconName}
              />
              {focused && <Text style={styles.label}>{label}</Text>}
            </View>
          );
        },
      })}
    >
      <Tab.Screen name='My Drive' component={Dashboard} />
      <Tab.Screen name='MyFiles' component={DashboardStarted} />
      <Tab.Screen name='Shared' component={DashboardShare} />
      <Tab.Screen name='Settings' component={DashboardTrash} />
      <Tab.Screen name='User' component={UserProfile} />
    </Tab.Navigator>
  );
};

export default BottomNavigation;

const styles = StyleSheet.create({
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    height:40
  },
  tabItemFocused: {
    backgroundColor: '#F1F4FE',
    borderRadius: 30,
  },
  label: {
    marginLeft: 5,
    color: '#007bff',
    fontSize: 14,
  },
});
