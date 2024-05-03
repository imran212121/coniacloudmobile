import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';
import { useNavigation } from '@react-navigation/native';

export default function Header({ modalHandler, handleLoader, loading }) {
  const user = useSelector((state) => state.auth.user);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const navigation = useNavigation();
  const pickDocument = async () => {
    //console.log('Click');
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      ////console.log('res', res);
      setSelectedDocument(res);
      handleLoader(true);
      setTimeout(()=>{
        
        uploadDocument()
      },500);
      
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
        //console.log('User cancelled document picker');
      } else {
        // Handle other errors
        console.error('Error picking document:', err);
      }
    }
  };

  const uploadDocument = async () => {
    if (!selectedDocument) {
      handleLoader(false);
      //console.log('No document selected');
      return;
    }
    try {
      const fileUri = selectedDocument[0].uri;
      const uploadUrl = 'https://drive.coniacloud.com/api/v1/uploads';
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
        { name: 'disk', data: 'uploads' }
      ]);

      console.log('Upload successful:', response.data);
      modalHandler(true, 'Upload successful', false);
      handleLoader(false);
    } catch (error) {
      modalHandler(true, 'Error uploading document', true);
      handleLoader(false);
      console.error('Error uploading document:', error);
    }

  };
  const settingScreen = () =>{
    console.log('settings');
    navigation.navigate('Settings');
  }
  return (
    <>

    
        <View style={styles.headerContainer}>
          <View>
            <Image source={{ uri: user?.avatar }} style={{ width: 50, height: 50, borderRadius: 25, marginTop: 12, marginLeft: 8 }} />
          </View>


          <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', marginLeft: 10, marginTop: 15, flexWrap: 'wrap' }}>
            <Text style={{ fontWeight: 400, fontSize: 13, color: '#696D70', height: 20 }}>Welcome back</Text>
            <Text style={{ fontWeight: 500, fontSize: 16, color: '#071625', height: 24 }}>{user?.display_name}</Text>
          </View>
          <View style={{ width: 100 }}>

          </View>
          <TouchableOpacity onPress={() => {
            pickDocument();
          }}>
            <Image source={require('../assets/upload.png')} style={styles.Icon} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={require('../assets/noti.png')} style={styles.Icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            settingScreen();
          }}>
            <Image source={require('../assets/settings.png')} style={styles.Icon} />
          </TouchableOpacity>
        </View>
      
    </>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    height: 70, paddingHorizontal: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start',
    borderBottomColor: '#e6e6e6', borderBottomWidth: 2, borderStyle: 'solid',backgroundColor:'white'
  },
  Icon: {
    width: 26,
    height: 26,
    marginLeft: 15
  }
})