import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { CommonActions, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomHeader from '../../components/CustomHeader';
import { AppColor } from '../../utils/AppColors';
import ProgressBar from '../../components/ProgressBar';
import { logout } from '../../redux/reducers/authSlice';
import { makeApiCall } from '../../helper/apiHelper';
import strings from '../../helper/Language/LocalizedStrings';

const UserProfile = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [storageInfo, setStorageInfo] = useState({ used: 0, available: 100, percentage: 0 });
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [userAvatar, setUserAvatar] = useState('');
  const [displayName, setDisplayName] = useState('');

  const fetchUserData = useCallback(async () => {
    try {
      const userData = JSON.parse(await AsyncStorage.getItem('user'));
      if (userData && userData.access_token) {
        setDisplayName(userData.display_name);
        setUserAvatar(userData.avatar);
        setToken(userData.access_token);
      } else {
        navigation.navigate('Login');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      navigation.navigate('Login');
    }
  }, [navigation]);

  const fetchStorageData = useCallback(async () => {
    try {
      const storage = await makeApiCall(`/api/v1/user/space-usage?timestamp=${Date.now()}`, token, 'get');
      const usedGB = Math.round(storage.used / 1024 ** 3);
      const availableGB = Math.round(storage.available / 1024 ** 3);
      const percentage = (storage.used / storage.available) * 100;
      setStorageInfo({ used: usedGB, available: availableGB, percentage });
    } catch (error) {
      console.error('Error fetching storage data:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    if (token) {
      fetchStorageData();
    }
  }, [fetchStorageData, token]);

  const logoutHandler = async () => {
    setLoggingOut(true);
    try {
      await AsyncStorage.removeItem('user');
      dispatch(logout());
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        })
      );
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setLoggingOut(false);
    }
  };

  const navigationData = [
    { id: 1, ImagePath: require('../../assets/icon/fi_user-check.png'), text: strings.ACCOUNT_INFORMATION, navigate: "Profile" },
    { id: 2, ImagePath: require('../../assets/icon/Lock.png'), text: strings.CHANGE_PASSWORD, navigate: "UpdatePassword" },
    { id: 3, ImagePath: require('../../assets/icon/smallFile.png'), text: strings.CHANGE_LANGUAGE, navigate: "choselanguage" },
  ];

  const renderNavigationItem = ({ id, ImagePath, text, navigate }) => (
    <TouchableOpacity
      key={id}
      style={styles.navigationItem}
      onPress={() => navigation.navigate(navigate)}
    >
      <Image source={ImagePath} style={styles.navigationIcon} />
      <Text style={styles.navigationText}>{text}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <CustomHeader back={true} left={true} title={strings.User} />
      <View style={styles.profileContainer}>
        <Image source={{ uri: userAvatar }} style={styles.avatar} />
        <View>
          <Text style={styles.heading}>{displayName}</Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={AppColor.primary} style={styles.loader} />
      ) : (
        <>
          <Text style={styles.storageText}>
            {storageInfo.used} GB of {storageInfo.available} {strings.GB_USED}
          </Text>
          <ProgressBar progress={storageInfo.percentage} />
        </>
      )}

      <View style={styles.navigationContainer}>
        {navigationData.map(renderNavigationItem)}
      </View>

      <TouchableOpacity onPress={logoutHandler} style={styles.logoutButton} disabled={loggingOut}>
        {loggingOut ? (
          <ActivityIndicator size="small" color="#FF4E4E" />
        ) : (
          <>
            <Image source={require('../../assets/icon/Logout.png')} style={styles.logoutIcon} />
            <Text style={styles.logoutText}>{strings.LOGOUT}</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: AppColor.bgcolor,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 25,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  heading: {
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 24,
    color: AppColor.noermalText,
  },
  loader: {
    marginTop: 20,
  },
  storageText: {
    fontWeight: '500',
    fontSize: 18,
    lineHeight: 27,
    marginTop: 40,
    color: AppColor.noermalText,
  },
  navigationContainer: {
    marginTop: 30,
  },
  navigationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  navigationIcon: {
    height: 25,
    width: 25,
    marginRight: 15,
    resizeMode: 'contain',
  },
  navigationText: {
    fontSize: 14,
    color: '#696D70',
    fontWeight: '400',
  },
  logoutButton: {
    marginTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  logoutIcon: {
    height: 30,
    width: 30,
  },
  logoutText: {
    color: '#FF4E4E',
    fontWeight: '500',
    fontSize: 16,
  },
});

export default UserProfile;