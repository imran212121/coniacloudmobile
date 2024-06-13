import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, Platform, Image } from 'react-native';
//import FontAwesome from '@react-native-vector-icons/fontawesome';
import Sound from 'react-native-sound';
import { AppSettings } from '../../utils/Settings';
import { makeApiCall } from '../../helper/apiHelper';
import share from '../../assets/icons/fi_user-plus.png'
import download from '../../assets/icons/fi_download.png'
import trash from '../../assets/icons/fi_trash-2.png'
import pause from '../../assets/icons/pause.png'
import play from '../../assets/icons/play.png'
import RNFetchBlob from 'rn-fetch-blob';
import { downloadFile, getDownloadPermissionAndroid } from '../../helper/downloadHelper';

const AudioPreview = ({ files, user, closeFile, folderId, handleFolderNavigation }) => {
    const [previewToken, setPreviewToken] = useState(null);
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const previewUrl = `${AppSettings.base_url}${files.url}`;
    const downloadUrl = `${AppSettings.base_url}/api/v1/file-entries/download/${files.hash}`;
    const deviceWidth = Dimensions.get('window').width;
    const deviceHeight = Dimensions.get('window').height;

    useEffect(() => {
        const fetchAudioData = async () => {
            try {
                const token = await makeApiCall(`/api/v1/file-entries/${files.id}/add-preview-token`, user?.access_token, 'post');
                setPreviewToken(token?.preview_token);
            } catch (error) {
                console.error('Error fetching preview token:', error);
            }
        };

        fetchAudioData();
    }, [files.id, user?.access_token]);

    const playPauseAudio = () => {
        if (sound) {
            if (isPlaying) {
                sound.pause();
                setIsPlaying(false);
            } else {
                sound.play();
                setIsPlaying(true);
            }
        } else {
            const newSound = new Sound(`${previewUrl}?preview_token=${previewToken}`, null, (error) => {
                if (error) {
                    console.error('Error loading sound:', error);
                    return;
                }
                setSound(newSound);
                setIsPlaying(true);
                newSound.play((success) => {
                    if (success) {
                        console.log('Successfully finished playing');
                    } else {
                        console.error('Playback failed due to audio decoding errors');
                    }
                    setIsPlaying(false);
                    newSound.release();
                    setSound(null);
                });
            });
        }
    };

    const downloadAndOpenFile = () => {
        const url = `${downloadUrl}?add-preview-token=${previewToken}`;
        const fileExtension = files?.extension;
        const fileName = files?.name;
        const fileNameWithExtension = `${fileName}.${fileExtension}`;

        if (Platform.OS === 'android') {
            getDownloadPermissionAndroid().then(granted => {
                if (granted) {
                    downloadFile(url, fileNameWithExtension);
                } else {
                    downloadFile(url, fileNameWithExtension);
                }
            });
        } else {
            downloadFile(url, fileNameWithExtension).then(res => {
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
            <View style={styles.audioContainer}>
                <TouchableOpacity onPress={playPauseAudio} style={styles.playButton}>
                    {/* <FontAwesome name={isPlaying ? 'pause' : 'play'} size={32} /> */}
                    {isPlaying ? <Image source={pause}/> : <Image source={play}/>}
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default AudioPreview;

const styles = StyleSheet.create({
    container: {
        width: 'auto',
        height: 'auto',
    },
    audioContainer: {
        width: 'auto',
        height: 'auto',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    playButton: {
        marginTop:20,
        width: 70,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ccc',
        borderRadius: 50,
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
