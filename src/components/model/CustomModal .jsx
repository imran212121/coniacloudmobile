import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';

const CustomModal = ({ visible, onClose, document }) => {
    
  const handleDownload = async () => {
    try {
      const downloadPath = `${RNFS.DocumentDirectoryPath}/${document.name}`;
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
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
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