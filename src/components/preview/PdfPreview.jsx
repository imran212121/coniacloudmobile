import { StyleSheet, Text, View, Image, Dimensions, TouchableOpacity, Platform, PermissionsAndroid } from 'react-native';
import React, { useEffect, useState } from 'react';
import { AppSettings } from '../../utils/Settings';
import { makeApiCall } from '../../helper/apiHelper';
import Pdf from 'react-native-pdf';
import share from '../../assets/icons/fi_user-plus.png';
import download from '../../assets/icons/fi_download.png';
import trash from '../../assets/icons/fi_trash-2.png';
import RNFetchBlob from 'rn-fetch-blob';
import { downloadFile, getDownloadPermissionAndroid } from '../../helper/downloadHelper';

const PdfPreview = ({ files, user, closeFile, folderId, handleFolderNavigation }) => {
    const [PreviewToken, setPreviewToken] = useState(false);
    const [pdfSource, setPdfSource] = useState({ uri: 'http:google.com' });
    let previewUrl = AppSettings.base_url + files.url;
    let downloadUrl = AppSettings.base_url + '/api/v1/file-entries/download/' + files.hash;
    const deviceWidth = Dimensions.get('window').width;
    const deviceHeight = Dimensions.get('window').height;

    useEffect(() => {
        const fetchImageData = async () => {
            try {
                const token = await makeApiCall('/api/v1/file-entries/' + files.id + '/add-preview-token', user?.access_token, 'post');
                setPreviewToken(token?.preview_token);
                setPdfSource({ uri: previewUrl + '?preview_token=' + PreviewToken });
                //console.log('previewUrl', previewUrl + '?preview_token=' + PreviewToken);
            } catch (error) {
                //console.log('error', error);
            }
        };
        setTimeout(() => {
            fetchImageData();
        }, 200);
    }, []);

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
                        <Image source={share} style={{ width: 15, height: 15 }} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.headerItem} onPress={downloadAndOpenFile}>
                        <Image source={download} style={{ width: 15, height: 15 }} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.headerItem} onPress={async () => {
                        let data = {
                            entryIds: [files.id],
                            deleteForever: 0,
                        };
                        const res = await makeApiCall('/api/v1/file-entries/delete', user?.access_token, 'post', data);
                        handleFolderNavigation(0);
                    }}>
                        <Image source={trash} style={{ width: 15, height: 15 }} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.imgcontainer}>
                <View style={{ justifyContent: 'center', flex: 1 }}>
                    {PreviewToken ? (
                        <Pdf
                            trustAllCerts={false}
                            source={{ uri: previewUrl + '?preview_token=' + PreviewToken }}
                            onLoadComplete={(numberOfPages, filePath) => {
                                //console.log(`Number of pages: ${numberOfPages}`);
                            }}
                            onPageChanged={(page, numberOfPages) => {
                                //console.log(`Current page: ${page}`);
                            }}
                            onError={(error) => {
                                //console.log(error);
                            }}
                            style={styles.pdf}
                        />
                    ) : (
                        <Text>Loading.....</Text>
                    )}
                </View>
            </View>
        </View>
    );
}

export default PdfPreview;

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
    img: {
        width: 100,
        height: 100,
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
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
});
