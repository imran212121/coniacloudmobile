import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';

const CustomModal = ({ visible, onClose, document,user, PreviewToken, setRefresh, refresh, }) => {
  console.log('first',document)

  const deleteFile = async () => {
    try {
      if (!document?.permissions?.['files.delete']) {
        Alert.alert('Permission Denied', 'You do not have permission to delete this file.');
        return;
      }

      let data = {
        entryIds: [document?.id], // Use document's id
        deleteForever: 0, // You can set it to 1 if you want to delete permanently
      };

      await makeApiCall('/api/v1/file-entries/delete', user?.access_token, 'post', data);

      // Refresh the file list after deletion
      setRefresh(!refresh);
      onClose(); // Close the modal after deletion
      Alert.alert('Success', 'File deleted successfully!');
    } catch (error) {
      console.error('Error deleting file:', error);
      Alert.alert('Error', 'Error deleting file.');
    }
  };

  const handleDownload = async () => {
    if (isFolder) {
      Alert.alert('Invalid Action', 'Folders cannot be downloaded.');
      return;
    }

    try {
      if (!document?.permissions?.['files.download']) {
        Alert.alert('Permission Denied', 'You do not have permission to download this file.');
        return;
      }

      const downloadPath = `${RNFS.DocumentDirectoryPath}/${document.file_name}`;
      await RNFS.downloadFile({
        fromUrl: document.url, 
        toFile: downloadPath,
      }).promise;

      console.log('File downloaded to:', downloadPath);
      alert('File downloaded successfully!');
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Error downloading file.');
    }
  };
    
  // const handleDownload = async () => {
  //   try {
  //     const downloadPath = `${RNFS.DocumentDirectoryPath}/${document.name}`;
  //     await RNFS.downloadFile({
  //       fromUrl: document.url, 
  //       toFile: downloadPath,
  //     }).promise;

  //     console.log('File downloaded to:', downloadPath);
  //     alert('File downloaded successfully!');
  //   } catch (error) {
  //     console.error('Error downloading file:', error);
  //     alert('Error downloading file.');
  //   }
  // };

  const handleShare = async () => {
    try {
      await Share.open({
        url: document.url,
        title: 'Share File',
        message: 'Check out this file!',
      });
    } catch (error) {
      console.error('Error sharing file:', error);
      alert('Error sharing file.');
    }
  };

  return (
    <Modal
    visible={visible}
    transparent
    animationType="slide"
    onRequestClose={onClose}
  >
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <View style={styles.header}>
          <Text style={styles.modalTitle}>File Options</Text>
          <TouchableOpacity onPress={onClose}>
            <Image
              source={require('../../assets/icons/close.png')}
              style={styles.closeIcon}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.iconButton} onPress={handleDownload}>
          <Icon name="file-download" size={30} color="#4F8EF7" />
          <Text style={styles.buttonText}>Download</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
          <Icon name="share" size={30} color="#4F8EF7" />
          <Text style={styles.buttonText}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() => alert('Delete')}>
          <Icon name="delete" size={30} color="#4F8EF7" />
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() => alert('Rename')}>
          <Icon name="edit" size={30} color="#4F8EF7" />
          <Text style={styles.buttonText}>Rename</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);
};

const styles = StyleSheet.create({
modalContainer: {
  flex: 1,
  justifyContent: 'flex-end',
  alignItems: 'center',
  backgroundColor: 'rgba(0,0,0,0.5)',
},
modalContent: {
  width: '100%',
  backgroundColor: '#fff',
  borderRadius: 10,
  padding: 20,
  alignItems: 'flex-start',
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
closeIcon: {
  height: 30,
  width: 30,
  resizeMode: 'contain',
},
iconButton: {
  flexDirection: 'row',
  alignItems: 'center',
  marginVertical: 10,
},
buttonText: {
  fontSize: 16,
  marginLeft: 10,
},
closeButton: {
  marginTop: 20,
},
closeButtonText: {
  color: 'red',
},
});

export default CustomModal