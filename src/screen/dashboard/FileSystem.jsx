import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';
import React, { useEffect, useState } from 'react';
import { TextInput } from 'react-native-gesture-handler';
import RNFS from 'react-native-fs'

const FileSystem = () => {



  const [modalVisible, setModalVisible] = useState(false);
const [currentPath,setcurrentPath]=useState(RNFS.DocumentDirectoryPath)

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Cool Photo App Storage Permission',
          message:
            'Cool Storage App needs access to your Storage ' +
            'so you can take awesome Storage.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use ');
      } else {
        console.log(' permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const getAllfolder=()=>{
RNFS.readDir(currentPath) 
  .then((contents) => {
    console.log(contents);
  })
  .catch((err) => {
    console.log(err.message, err.code);
  });
  }
  useEffect(()=>{

  },[])
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.btn} onPress={() => setModalVisible(true)}>
        <Text style={styles.text}>+</Text>
      </TouchableOpacity>
      <Text>FileSystem</Text>
      <Modal
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TextInput
              placeholder="Enter Folder Name"
              style={styles.input}
            />
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.createButtonText}>Create Folder</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default FileSystem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    position: 'absolute',
    right: 20,
    bottom: 40,
    backgroundColor: '#000',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 30,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    width: '90%',
    height: 200,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '90%',
    height: 50,
    borderWidth: 1,
    paddingLeft: 20,
    borderRadius: 10,
    marginTop: 50,
  },
  createButton: {
    marginTop: 15,
    width: '90%',
    height: 50,
    borderRadius: 10,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
  },
});
