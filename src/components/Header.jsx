import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseURL } from '../constant/settings';
import IconBadge from 'react-native-icon-badge';
import { setLanguage } from '../redux/reducers/languageSlice'; 
import strings from '../helper/Language/LocalizedStrings';
import { useSelector } from 'react-redux';
export default function Header({ modalHandler, handleLoader, loading, handleRefresh, refresh, uploadIcon, notiIcon, settingsIcon,onPress }) {
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [user, setUser] = useState(null);
  const navigation = useNavigation();
  const language = useSelector((state) => state.language.language);
  useEffect(() => {
    const checkLoginStatus = async () => {
      const userData = JSON.parse(await AsyncStorage.getItem('user'));
      if (userData && userData.access_token) {
        setUser(userData);
      }
    };
    checkLoginStatus();
  }, []);

  const pickDocument = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      setSelectedDocument(res);
      handleLoader(true);
      setTimeout(() => {
        uploadDocument();
      }, 1000);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled document picker');
      } else {
        console.error('Error picking document:', err);
      }
    }
  };

  const uploadDocument = async () => {
    if (!selectedDocument) {
      handleLoader(false);
      console.log('No document selected');
      return;
    }
    try {
      const fileUri = selectedDocument[0].uri;
      const uploadUrl = `${baseURL}/uploads`;
      const token = user?.access_token;

      const response = await RNFetchBlob.fetch('POST', uploadUrl, {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'multipart/form-data',
      }, [
        { name: 'file', filename: selectedDocument[0].name, data: RNFetchBlob.wrap(fileUri) },
        { name: 'workspaceId', data: '0' },
        { name: 'parentId', data: 'null' },
        { name: 'isSQL', data: 'false' },
        { name: 'relativePath', data: '' },
        { name: 'disk', data: 'uploads' },
      ]);

      console.log('Upload successful:', response.data);
      modalHandler(true, 'Upload successful', false);
      handleLoader(false);
      handleRefresh(!refresh);
    } catch (error) {
      modalHandler(true, 'Error uploading document', true);
      handleLoader(false);
      console.error('Error uploading document:', error);
    }
  };

  const settingScreen = () => {
    console.log('settings');
    navigation.navigate('Settings');
  };

  return (
    <>
    
        <View style={styles.headerContainer}>
          <View style={{ flexDirection: 'row' }}>
            <Image source={{ uri: user?.avatar }} style={styles.avatar} />
            <View style={styles.userInfo}>
              <Text style={styles.welcomeText}>{strings.WELCOME_BACK}</Text>
              <Text style={styles.userName}>{user?.display_name}</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity onPress={() => navigation.navigate('UploadDoc')}>
              <Image source={uploadIcon || require('../assets/upload.png')} style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onPress}>
              <Image source={notiIcon || require('../assets/noti.png')} style={styles.icon} />
            
            </TouchableOpacity>
          {!notiIcon ? 
          <View style={{height:10,width:10,backgroundColor:'red',position:'absolute',right:0,bottom:15,borderRadius:10}}>
            </View>:null}
            {/* Uncomment this if you want to include the settings button */}
            {/* <TouchableOpacity onPress={settingScreen}>
              <Image source={settingsIcon || require('../assets/settings.png')} style={styles.icon} />
            </TouchableOpacity> */}
          </View>
        </View>
     
    </>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    height: 70,
    paddingHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // borderBottomColor: '#e6e6e6',
    // borderBottomWidth: 2,
    // backgroundColor: 'white',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginTop: 12,
    marginLeft: 8,
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 15,
  },
  welcomeText: {
    fontWeight: '400',
    fontSize: 13,
    color: '#696D70',
    height: 20,
  },
  userName: {
    fontWeight: '500',
    fontSize: 16,
    color: '#071625',
    height: 24,
  },
  icon: {
    width: 26,
    height: 26,
    marginLeft: 15,
  },
});
