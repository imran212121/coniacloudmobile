import { StyleSheet, Text, View, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { AppColor } from '../utils/AppColors';
import CustomHeader from './CustomHeader';
import Switch from './Switchcomponent';
import { logout } from '../redux/reducers/authSlice';
import { setLanguage } from '../redux/reducers/languageSlice'; // Import setLanguage action
import strings from '../helper/Language/LocalizedStrings';
import CustomButton from './CustomButton';

const SettingsScreen = () => {
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const language = useSelector((state) => state.language.language); // Get the current language from the Redux store

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    if (user === null) {
      navigation.navigate('Login');
    }
  }, [user]);

  const onChangeLanguage = (lang) => {
    dispatch(setLanguage(lang)); 
  };

  const logoutHandler = () => {
    dispatch(logout());
  };

  const Data = [
    {
      id: 1,
      ImagePath: require('../assets/icon/fi_user-plus.png'),
      text: strings.ADD_ACCOUNT,
      screen: '',
    },
    {
      id: 2,
      ImagePath: require('../assets/icon/Lock.png'),
      text: strings.CHANGE_PASSWORD,
      screen: '',
    },
    {
      id: 3,
      ImagePath: require('../assets/icon/fi_user-check.png'),
      text: strings.ACCOUNT_INFORMATION,
      screen: '',
    },
    {
      id: 4,
      ImagePath: require('../assets/icon/Smallfolder.png'),
      text: strings.UPGRADE_PLAN,
      screen: '',
    },
    {
      id: 5,
      ImagePath: require('../assets/icon/smallFile.png'),
      text: strings.CHANGE_LANGUAGE,
      screen: 'choselanguage',
    },
    {
      id: 6,
      ImagePath: require('../assets/icon/SmallFile1.png'),
      text: strings.ACCOUNT_INFORMATION,
      screen: '',
    },
  ];

  return (
    <View style={{ marginTop: 2, flex: 1, flexDirection: 'column' }}>
      {loading ? (
        <View style={{ flex: 1, paddingVertical: 150, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="extra-large" color="#004181" animating={true} />
        </View>
      ) : (
        <>
          <View style={styles.container}>
            <CustomHeader back={true} left={true} title={strings.SETTINGS} onPress={() => navigation.goBack()} />
            <View style={styles.Box}>
              {Data.map((item) => (
                <TouchableOpacity key={item.id} style={{ flexDirection: 'row', marginTop: 10, marginVertical: 15 }} onPress={() => navigation.navigate(item.screen)}>
                  <Image source={item.ImagePath} style={{ height: 25, width: 25, marginRight: 15, resizeMode: 'contain' }} />
                  <Text style={{ fontSize: 14, color: '#696D70', fontWeight: '400' }}>{item.text}</Text>
                </TouchableOpacity>
              ))}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.headingText}>{strings.ENABLE_SYNC}</Text>
                <Switch />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.headingText}>{strings.ENABLE_2STEP_VERIFICATION}</Text>
                <Switch />
              </View>
              <TouchableOpacity onPress={logoutHandler} style={{ marginTop: 40, flexDirection: 'row', alignItems: 'center', gap: 20 }}>
                <Image source={require('../assets/icon/Logout.png')} style={{ height: 30, width: 30 }} />
                <Text style={[styles.headingText, { color: '#FF4E4E', marginTop: 0 }]}>{strings.LOGOUT}</Text>
              </TouchableOpacity>
              {/* <CustomButton buttonTitle="Turkish" onPress={() => onChangeLanguage('tur')} /> */}
              {/* <CustomButton buttonTitle="English" onPress={() => onChangeLanguage('eng')} /> */}
            </View>
          </View>
        </>
      )}
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColor.bgcolor,
    padding: 15,
  },
  Box: {
    width: '100%',
    height: '89%',
    backgroundColor: AppColor.white,
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    marginTop: 10,
  },
  headingText: {
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 21,
    color: AppColor.normalText,
    marginTop: 14,
  },
});
