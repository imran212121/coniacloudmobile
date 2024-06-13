import { StyleSheet, Text, View, Dimensions, TouchableOpacity, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import { AppSettings } from '../../utils/Settings';
import { makeApiCall } from '../../helper/apiHelper';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import { WebView } from 'react-native-webview';

import RNFetchBlob from 'rn-fetch-blob';
import { downloadFile, getDownloadPermissionAndroid } from '../../helper/downloadHelper';

const WordPreview = ({ files, user, closeFile, folderId, handleFolderNavigation }) => {
    const [PreviewToken, setPreviewToken] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const previewUrl = AppSettings.base_url + files.url;
    const downloadUrl = AppSettings.base_url + '/api/v1/file-entries/download/' + files.hash;
    const deviceWidth = Dimensions.get('window').width;
    const deviceHeight = Dimensions.get('window').height;



    useEffect(() => {
        const fetchDocumentData = async () => {
            try {
                const token = await makeApiCall('/api/v1/file-entries/' + files.id + '/add-preview-token', user?.access_token, 'post');
                setPreviewToken(token?.preview_token);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching document preview token:', error);
                setIsLoading(false);
            }
        };

        fetchDocumentData();
    }, [files.id, user?.access_token]);

    const downloadAndOpenFile = () => {
        const url = downloadUrl + '?add-preview-token=' + PreviewToken;
        const file_extension = files?.extension;
        const file_name = files?.name;
        const file_name_with_extension = file_name + '.' + file_extension;

        if (Platform.OS === 'android') {
            getDownloadPermissionAndroid().then(granted => {
                if (granted) {
                    downloadFile(url, file_name_with_extension);
                } else {
                    downloadFile(url, file_name_with_extension);
                }
            });
        } else {
            downloadFile(url, file_name_with_extension).then(res => {
                RNFetchBlob.ios.previewDocument(res.path());
            });
        }
    };

    return (
        <View>
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
            <View style={styles.doccontainer}>
                <View style={{ justifyContent: 'center', flex: 1 }}>
                    {isLoading ? (
                        <Text>Loading.....</Text>
                    ) : (
                        <WebView 
                            source={{ uri: previewUrl + '?preview_token=' + PreviewToken }} 
                            style={{ width: deviceWidth, height: deviceHeight }} 
                        />
                    )}
                </View>
            </View>
        </View>
    );
};

export default WordPreview;

const styles = StyleSheet.create({
    container: {
        width: 'auto',
        height: 'auto',
    },
    doccontainer: {
        width: 'auto',
        height: 'auto',
        display: 'flex',
        flexDirection: 'row',
    },
    header: {
        backgroundColor: '#fff',
        height: 55,
        width: 'auto',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    headerItem: {
        marginRight: 20,
        marginLeft: 10,
        paddingVertical: 12,
    },
});
