import { Image, StyleSheet, Text, TouchableOpacity, View, Button, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { AppColor } from '../../utils/AppColors'
import CustomHeader from '../../components/CustomHeader'
import { useNavigation } from '@react-navigation/native'
import DocumentPicker from 'react-native-document-picker'
import AsyncStorage from '@react-native-async-storage/async-storage'
import RNFetchBlob from 'rn-fetch-blob'
import { AlertNotificationRoot, Dialog, ALERT_TYPE } from 'react-native-alert-notification'
import { baseURL } from '../../constant/settings'
import { setLanguage } from '../../redux/reducers/languageSlice'; 
import strings from '../../helper/Language/LocalizedStrings';
import { useSelector } from 'react-redux'
const UploadDoc = () => {
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigation = useNavigation()
  const language = useSelector((state) => state.language.language);
  useEffect(() => {
    const checkLoginStatus = async () => {
      const userData = JSON.parse(await AsyncStorage.getItem('user'))
      if (userData && userData.access_token) {
        setUser(userData)
      }
    }
    checkLoginStatus()
  }, [])

  const pickDocument = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      })
      setSelectedDocument(res)
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled document picker')
      } else {
        console.error('Error picking document:', err)
      }
    }
  }

  const uploadDocument = async () => {
    if (!selectedDocument) {
      console.log('No document selected')
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: 'Warning',
        textBody: 'No document selected',
        button: 'close',
      })
      return
    }
    setLoading(true)
    try {
      const fileUri = selectedDocument[0].uri
      const uploadUrl = baseURL+'/uploads';
      const token = user?.access_token
      
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
      ])

      console.log('Upload successful:', response.data)
      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: 'Success',
        textBody: 'Upload successful',
        button: 'close',
      })
      setLoading(false)
      setTimeout(()=>{
        navigation.navigate('Home');
      },1000);
    } catch (error) {
      console.error('Error uploading document:', error)
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'Error uploading document',
        button: 'close',
      })
      setLoading(false)
    }
  }

  
  return (
    <AlertNotificationRoot>
      <View style={styles.container}>
        <CustomHeader back={true} left={true} title={strings.UPLOAD_FILE} OnPress={() => navigation.goBack()} />
        <View style={styles.box}>
          <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
            <Image source={require('../../assets/upload.png')} tintColor={'#004181'} />
          </TouchableOpacity>
          <Text style={styles.boldtext}>{strings.DRAG_DROP_FILES}</Text>
          <Text style={styles.normaltext}>{strings.SUPPORT_ZIP_RAR}</Text>
          <TouchableOpacity onPress={uploadDocument} style={styles.uploadActionButton}>
          {loading ? (
            <ActivityIndicator size="small" color="#004181" />
          ) : (
            <Text style={styles.buttonText}>{strings.UPLOAD_DOC}</Text>
          )}
        </TouchableOpacity>
        </View>
     
        
      </View>
    </AlertNotificationRoot>
  )
}

export default UploadDoc

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F1F1",
    padding: 15,
  },
  box: {
    height: '45%',
    width: '95%',
    backgroundColor: '#B8D8F7',
    alignSelf: 'center',
    marginTop: '40%',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButton: {
    height: 70,
    width: 70,
    borderRadius: 50,
    backgroundColor: '#00418126',
    alignItems: 'center',
    justifyContent: 'center',
  },
  boldtext: {
    fontWeight: '500',
    lineHeight: 21,
    fontSize: 14,
    color: '#071625',
  },
  normaltext: {
    color: '#696D70',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '400',
  },
  buttonText: {
    color: AppColor.white,
    fontWeight: '500',
  },
  uploadActionButton: {
    width:"90%",
    marginTop: 30,
    backgroundColor: '#004181',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
