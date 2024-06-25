import { StyleSheet, Text, View, Dimensions, TouchableOpacity, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import { AppSettings } from '../../utils/Settings';
import { makeApiCallWithHeader, makeApiCall } from '../../helper/apiHelper';
import RNFetchBlob from 'rn-fetch-blob';
import share from '../../assets/icons/fi_user-plus.png'
import download from '../../assets/icons/fi_download.png'
import trash from '../../assets/icons/fi_trash-2.png'
import { downloadFile, getDownloadPermissionAndroid } from '../../helper/downloadHelper';

const TextPreview = ({ files, user, closeFile, handleFolderNavigation }) => {
    const [previewToken, setPreviewToken] = useState(null);
    const [isFailed, setIsFailed] = useState(false);
    const [tooLarge, setTooLarge] = useState(false);
    const [contents, setContents] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const deviceWidth = Dimensions.get('window').width;
    const deviceHeight = Dimensions.get('window').height;
    const previewUrl = AppSettings.base_url + files.url;
    const downloadUrl = AppSettings.base_url + '/api/v1/file-entries/download/' + files.hash;

    useEffect(() => {
        const fetchTextContent = async () => {
            if (!previewUrl) {
                setIsFailed(true);
            } else if (files.file_size > 50000) {
                setTooLarge(true);
                setIsLoading(false);
            } else {
                try {
                    const token = await makeApiCall('/api/v1/file-entries/' + files.id + '/add-preview-token', user?.access_token, 'post');
                    setPreviewToken(token?.preview_token);
                    const fullPreviewUrl = `${previewUrl}?preview_token=${token?.preview_token}`;
                    const response = await getFileContents(fullPreviewUrl);
                    setContents(response);
                } catch (error) {
                    setIsFailed(true);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        fetchTextContent();
    }, [files.id, previewUrl, user?.access_token]);

    const getFileContents = async (src) => {
        return makeApiCallWithHeader(src, 'get');
    };

    const downloadAndOpenFile = () => {
        const url = `${downloadUrl}?add-preview-token=${previewToken}`;
        const file_extension = files?.extension;
        const file_name = files?.name;
        const file_name_with_extension = `${file_name}.${file_extension}`;
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

    useEffect(() => {
        if (tooLarge) {
            setContents("This file is too large to preview.");
        }
    }, [tooLarge]);

    useEffect(() => {
        if (isFailed) {
            setContents("There was an issue previewing this file.");
        }
    }, [isFailed]);

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
       ////console.log('res',res)
}}>
    <Image source={trash} style={{width:15,height:15}}/>
</TouchableOpacity>

</View>   
            </View>
            <View style={styles.imgcontainer}>
                <View style={{ justifyContent: 'center', flex: 1 }}>
                    {isLoading ? (
                        <Text>Loading.....</Text>
                    ) : (
                        <Text style={{ width: deviceWidth-1, height: deviceHeight, padding: 20, backgroundColor: '#FFF',borderRadius:5,marginTop:1 }}>
                            {contents}
                        </Text>
                    )}
                </View>
            </View>
        </View>
    );
};

export default TextPreview;

const styles = StyleSheet.create({
    container: {
        width: 'auto',
        height: 'auto',
    },
    imgcontainer: {
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
