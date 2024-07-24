import { StyleSheet, Text, Image, View } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Dashboard from '../screen/dashboard/Dashboard';
import DashboardMyfiles from '../screen/dashboard/DashboardStarted';
import DashboardShare from '../screen/dashboard/DashboardShare';
import DashboardTrash from '../screen/dashboard/DashboardTrash';
import UserProfile from '../screen/dashboard/UserProfile';
import SettingsScreen from '../components/SettingsScreen';
import Settings from '../screen/settings/Settings';
import Trashed from '../components/Trash';

import { setLanguage } from '../redux/reducers/languageSlice'; 
import strings from '../helper/Language/LocalizedStrings';
import { useSelector } from 'react-redux';

const Tab = createBottomTabNavigator();

const BottomNavigation = () => {
  const language = useSelector((state) => state.language.language);
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          height: 60,
          paddingBottom: 5,
          paddingHorizontal:10
        
        },
        tabBarShowLabel: false, 
        tabBarIcon: ({ focused }) => {
          let iconName;
          let label;
          let iconSize = 20;

          switch (route.name) {
            case 'My Drive':
              iconName = require('../assets/icons/home.png');
              label = strings.HOME;
              iconSize = 20;
              break;
              case 'Recents':
              iconName = require('../assets/icons/AddDoc.png');
              label = strings.MyFiles;
              break;
            case 'Shared':
              iconName = require('../assets/icons/Users.png');
              label = strings.Shared;
              break;
            case 'Settings':
              iconName = require('../assets/icons/setting.png');
              label = strings.Settings;
              break;
              case 'User':
                iconName = require('../assets/icons/user.png');
                label = strings.User;
                break;
                case 'Trash':
                iconName = require('../assets/icons/trash.png');
                label = strings.TRASH_FILE;
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
                  tintColor: focused ? '#007bff' : '#414a4c' 
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
      <Tab.Screen name='Recents' component={DashboardMyfiles} />
      <Tab.Screen name='Shared' component={DashboardShare} />
      {/* <Tab.Screen name='Trash' component={Trashed} /> */}
       <Tab.Screen name='Trash' component={DashboardTrash} /> 
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
    borderRadius: 15,
    paddingHorizontal:5,
    width:115
  },
  label: {
    marginLeft: 5,
    color: '#007bff',
    fontSize: 14,
  },
});
