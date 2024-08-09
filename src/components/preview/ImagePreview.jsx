import { StyleSheet, Text, View, Image, Dimensions, TouchableOpacity, Alert, Platform, PermissionsAndroid } from 'react-native'

import React, { useEffect, useState } from 'react';
import { AppSettings } from '../../utils/Settings'
import {makeApiCall} from '../../helper/apiHelper';
import Icon from 'react-native-vector-icons/FontAwesome';

import PushNotification from 'react-native-push-notification';
import RNFetchBlob from 'rn-fetch-blob';
import { downloadFile, getDownloadPermissionAndroid } from '../../helper/downloadHelper';
import share from '../../assets/icons/fi_user-plus.png'
import download from '../../assets/icons/fi_download.png'
import trash from '../../assets/icons/fi_trash-2.png'
import close from '../../assets/icons/close.png'
import { useSelector } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';


const ImagePreview = ({ files, user, closeFile,folderId,handleFolderNavigation }) => {
    
    const [PreviewToken, setPreviewToken] = useState(false)
    let previewUrl = AppSettings.base_url + files.url;
    let downloadUrl = AppSettings.base_url + '/api/v1/file-entries/download/' + files.hash;
    const deviceWidth = Dimensions.get('window').width;
    const deviceHeight = Dimensions.get('window').height;
    //const users = useSelector((state)=>state.auth)
    const  users  = useSelector((state) => state.auth.user);

    useEffect(() => {
        const fetchImageData = async () => {
            try {
                const token = await makeApiCall('/api/v1/file-entries/' + files.id + '/add-preview-token', users?.access_token, 'post');
                
                console.log('token', token?.preview_token);
                setPreviewToken(token?.preview_token);
                console.log(previewUrl + '?preview_token=' + PreviewToken);

            } catch (error) {
                console.log('error', error);
            }
        }
        setTimeout(() => {
            fetchImageData();

        }, 200)

    }, [users])
    //console.log('deviceWidth', deviceWidth);

    const downloadAndOpenFile = async() => {
        const url = downloadUrl + '?add-preview-token=' + PreviewToken;
        const file_extension = files?.extension;
        const file_name = files?.name;
        const file_name_with_extension = file_name + '.' + file_extension;
        //console.log(Platform.OS);
        if (Platform.OS === 'android') {
            const hasPermission = await getDownloadPermissionAndroid();
            if (!hasPermission) {
              Alert.alert('Permission denied', 'You need to grant storage permission to download files.');
              return;
            }
          }
          const filePath = await downloadFile(fileUrl, fileName);
          if (filePath) {
            Alert.alert('Download complete', `File downloaded to ${filePath}`);
          } else {
            Alert.alert('Download failed', 'There was an error downloading the file.');
          }
        
        // if (Platform.OS === 'android') {
        //     //console.log('sss');
        //     getDownloadPermissionAndroid().then(granted => {
        //         if (granted) {
        //             //console.log('sss');
        //             downloadFile(url, file_name_with_extension);
        //         } else {
        //             downloadFile(url, file_name_with_extension);
        //             //console.log('sssaa');
        //         }
        //     });
        // } else {
        //     downloadFile(url, file_name_with_extension).then(res => {
        //         RNFetchBlob.ios.previewDocument(res.path());
        //     });
        // }



    };


    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.header}>

                    <TouchableOpacity style={styles.headerItem}>
                        {/* <Icon name="share" size={22} /> */}
                        <Image source={share} style={{width:15,height:15}}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.headerItem} onPress={() => {
                        downloadAndOpenFile()
                    }}>
                        {/* <Icon name="download" size={22} /> */}
                        <Image source={download} style={{width:15,height:15}}/>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.headerItem} onPress={async() => {
                           let data = {
                            entryIds:[files.id],
                            deleteForever:0,
                            
                           }
                           const res = await makeApiCall('/api/v1/file-entries/delete', user?.access_token, 'post',data);
                           handleFolderNavigation(0);
                           //console.log('res',res)
                    }}>
                        <Image source={trash} style={{width:15,height:15}}/>
                    </TouchableOpacity>

                </View>
            </View>
            <View style={styles.imgcontainer}>
                <View style={{ justifyContent: 'center', flex: 1 }}>
                    {PreviewToken ?
                        <Image source={{ uri: previewUrl + '?preview_token=' + PreviewToken }} style={{ width: deviceWidth-50, height: deviceHeight-50 }} />
                        : <Text>Loading.....</Text>}
                </View>
            </View>
        </ScrollView>
    )
}

export default ImagePreview

const styles = StyleSheet.create({
    container: {
        width: 'auto',
        height: 'auto',

    },
    imgcontainer: {
        margin:20,
        display: 'flex',
        flexDirection: 'row',
        alignItems:'center'
    },
    img: {
        minWidth: 50,
        minHeight: 100

    },
    header: {
        backgroundColor: '#fff',
        height: 55,
        width: 'auto',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    headerItem: {
        marginRight: 20,
        marginLeft: 10,
        paddingVertical: 12
    }
});