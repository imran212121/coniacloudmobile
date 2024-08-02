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

const ModalComponent = ({ isVisible, onClose, item, user, PreviewToken, setRefresh, refresh, setModalVisible }) => {
  const [isShareModalVisible, setShareModalVisible] = useState(false);
  const [isRenameModalVisible, setRenameModalVisible] = useState(false);

  const sharePopup = () => {
    setShareModalVisible(true);
  };

  const toggleShareModal = () => {
    setShareModalVisible(!isShareModalVisible);
  };

  const toggleRenameModal = () => {
    setRenameModalVisible(!isRenameModalVisible);
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
    } catch (error) {
      console.error('Error deleting file:', error);
      Alert.alert('Error', 'Error deleting file.');
    }
  };

  const downloadAndOpenFile = async () => {
    const downloadUrl = `${AppSettings.base_url}/api/v1/file-entries/download/${item?.hash}?add-preview-token=${PreviewToken}`;
    const filename = item?.name || 'downloaded_file';
    const fileExt = item?.extension || 'file';
    const { dirs } = RNFetchBlob.fs;
    const path = `${dirs.DownloadDir}/${filename}.${fileExt}`;

    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message: 'App needs access to your storage to download files',
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Storage Permission Not Granted');
          return;
        }
      }

      RNFetchBlob.config({
        fileCache: true,
        appendExt: fileExt,
        path,
      })
        .fetch('GET', downloadUrl)
        .then(res => {
          console.log('File saved to:', res.path());
          saveAndShare(res.path());
        })
        .catch(error => {
          console.error('Error downloading file:', error);
          Alert.alert('Error downloading file.');
        });
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('An error occurred.');
    }
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
            <TouchableOpacity style={styles.itemContainer} onPress={downloadAndOpenFile}>
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
        isVisible={isRenameModalVisible}
        onClose={toggleRenameModal}
        setRefresh={setRefresh}
        refresh={refresh}
        user={user}
        file={item}
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
