import { StyleSheet, Text, Image, View, BackHandler, Alert } from 'react-native';
import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import Dashboard from '../screen/dashboard/Dashboard';
import DashboardShare from '../screen/dashboard/DashboardShare';
import DashboardTrash from '../screen/dashboard/DashboardTrash';
import UserProfile from '../screen/dashboard/UserProfile';
import FileSystem from '../screen/dashboard/FileSystem';
import strings from '../helper/Language/LocalizedStrings';
import { useSelector } from 'react-redux';

const Tab = createBottomTabNavigator();

const BottomNavigation = ({ navigation }) => {
  const language = useSelector((state) => state.language.language);

  const handleBackButton = () => {
    const currentRouteIndex = navigation.getState().routes[navigation.getState().index].name;

    if (currentRouteIndex === 'FileSystem') {
      // If on the FileSystem screen, show the exit alert
      Alert.alert(
        'Exit App',
        'Are you sure you want to exit?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'OK', onPress: () => BackHandler.exitApp() },
        ],
        { cancelable: false }
      );
      return true;
    } else {
      // Navigate to the first tab (FileSystem) if not already there
      // navigation.navigate('FileSystem');
      return true;
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => handleBackButton();

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation])
  );

  return (
    <Tab.Navigator
      backBehaviour="initialRoute"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0071BC',
          height: 70,
          paddingHorizontal: 10,
        },
        tabBarShowLabel: false,
        tabBarIcon: ({ focused }) => {
          let iconName;
          let label;
          let iconSize = 20;

          switch (route.name) {
            case 'FileSystem':
              iconName = require('../assets/icons/Dashboard.png');
              label = strings.HOME;
              iconSize = 20;
              break;
            case 'My Drive':
              iconName = require('../assets/MyDrive.png');
              label = 'My Drive';
              iconSize = 20;
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
                  tintColor: focused ? '#007bff' : '#F1F4FE',
                  resizeMode: 'contain',
                }}
                source={iconName}
              />
              {focused && <Text style={styles.label}>{label}</Text>}
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="FileSystem" component={FileSystem} />
      <Tab.Screen name="My Drive" component={Dashboard} />
      <Tab.Screen name="Shared" component={DashboardShare} />
      <Tab.Screen name="Trash" component={DashboardTrash} />
      <Tab.Screen name="User" component={UserProfile} />
    </Tab.Navigator>
  );
};

export default BottomNavigation;

const styles = StyleSheet.create({
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    height: 40,
  },
  tabItemFocused: {
    backgroundColor: '#F1F4FE',
    borderRadius: 10,
    paddingHorizontal: 5,
    width: 100,
    left: 8,
    right: 5,
  },
  label: {
    marginLeft: 5,
    color: '#007bff',
    fontSize: 14,
  },
});
