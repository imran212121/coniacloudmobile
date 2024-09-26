import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, Alert, Platform } from 'react-native';
import ShareFileModal from './model/Share';
import RenameModal from './model/Rename';
import { downloadFile, getDownloadPermissionAndroid } from '../helper/downloadHelper';
import RNFetchBlob from 'rn-fetch-blob';
import { AppSettings } from '../utils/Settings';
import { makeApiCall } from '../helper/apiHelper';
import strings from '../helper/Language/LocalizedStrings';
import { PermissionsAndroid, } from 'react-native';

const ModalComponent = ({ isVisible, onClose, item, user, PreviewToken, setRefresh, refresh, setModalVisible, }) => {
 
  const [isShareModalVisible, setShareModalVisible] = useState(false);
  const [isRenameModalVisible, setRenameModalVisible] = useState(false);

  const sharePopup = () => {
    setShareModalVisible(true);
  };
  const handleRenameSuccess = () => {
    setRefresh(prev => !prev);
    setModalVisible(false);
    // setRefresh(false)
  };
  const toggleShareModal = () => {
    setShareModalVisible(!isShareModalVisible);
  };

  const toggleRenameModal = () => {
    setRenameModalVisible(!isRenameModalVisible);
    setRefresh(prev => !prev);
    setModalVisible(false);
    // setRefresh(false)
  };

  const deleteFile = async () => {
    try {
      let data = {
        entryIds: [item?.id],
        deleteForever: 0,
      };
      await makeApiCall('/api/v1/file-entries/delete', user?.access_token, 'post', data);
      setRefresh(!refresh);
      setModalVisible(!isVisible);
      Alert.alert('Success', 'File deleted successfully!');
      setRefresh(false)
    } catch (error) {
      console.error('Error deleting file:', error);
      Alert.alert('Error', 'Error deleting file.');
    }
  };


  const downloadFile = async (fileHash, previewToken, fileName) => {
    const downloadUrl = `${AppSettings.base_url}/api/v1/file-entries/download/${fileHash}?add-preview-token=${previewToken}`;
  
    // Request permission for Android
    // const granted = await requestStoragePermission();
    // if (!granted) {
    //   Alert.alert('Permission Denied', 'Storage permission is required to download files.');
    //   return;
    // }
  
    const { fs } = RNFetchBlob;
    const downloadsPath = Platform.OS === 'android' ? fs.dirs.DownloadDir : fs.dirs.DocumentDir; // Adjust path based on platform
    const localPath = `${downloadsPath}/${fileName}`; // Path to store the downloaded file
  
    RNFetchBlob
      .config({
        path: localPath, // Save the file to this path
        fileCache: true,
        appendExt: fileName.split('.').pop(), // Extract file extension and append it (e.g., jpg, pdf)
      })
      .fetch('GET', downloadUrl)
      .then((res) => {
        console.log('File downloaded and saved locally at:', res.path());
        Alert.alert('Success', 'File downloaded successfully!');
      })
      .catch((error) => {
        console.error('Error downloading the file:', error.message);
        Alert.alert('Error', 'Failed to download the file.');
      });
  };

  return (
    <>
      <Modal
        transparent
        visible={isVisible}
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
          <View style={styles.header}>
          <Text style={styles.modalTitle}>File Options</Text>
          <TouchableOpacity onPress={onClose}>
            <Image
              source={require('../assets/icons/close.png')}
              style={styles.closeIcon}
            />
          </TouchableOpacity>
        </View>
            <TouchableOpacity style={styles.itemContainer} onPress={sharePopup}>
              <Image source={require('../assets/icons/share.png')} style={styles.image} />
              <Text>{strings.SHARE}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.itemContainer} onPress={() => downloadFile(item?.hash, PreviewToken, item?.name)}>
              <Image source={require('../assets/icons/fi_download.png')} style={styles.image} />
              <Text>{strings.DOWNLOAD}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.itemContainer} onPress={toggleRenameModal}>
              <Image source={require('../assets/Modalicon/fi_edit-2.png')} style={styles.image} />
              <Text>Rename</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.itemContainer} onPress={deleteFile}>
              <Image source={require('../assets/Modalicon/fi_trash-2.png')} style={styles.image} />
              <Text>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <ShareFileModal
        isVisible={isShareModalVisible}
        onClose={toggleShareModal}
        user={user}
        file={item}
      />
      <RenameModal
        // isVisible={isRenameModalVisible}
        // onClose={toggleRenameModal}
        // setRefresh={setRefresh}
        // refresh={refresh}
        // user={user}
        // file={item}
        isVisible={isRenameModalVisible}
        onClose={toggleRenameModal}
        setRefresh={setRefresh}
        refresh={refresh}
        user={user}
        file={item}
        onRenameSuccess={handleRenameSuccess}
      />
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  image: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
    marginRight: 15,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  closeIcon: {
    height: 30,
    width: 30,
    resizeMode: 'contain',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ModalComponent;
