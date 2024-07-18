import React, { useState,useEffect } from 'react';
import { View, Text, TextInput, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { AlertNotificationRoot, Dialog, ALERT_TYPE } from 'react-native-alert-notification'

import { makeApiCall } from '../../helper/apiHelper';


const RenameModal = ({ isVisible, onClose, file,user,setRefresh,refresh }) => {
  const [initialName, setInitialName] = useState(file?.name);
  const [name, setName] = useState(file?.name);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

   useEffect(()=>{
    setTimeout(()=>{
      setName(file?.name);
      setInitialName(file?.name);
    },100)
   },[])


  const renameFile = async () => {
    if (name=="") {
        setError('Please enter file name');
        return;
      }
      setError('');
      setLoading(true);
    try {
        console.log('file',file,user?.access_token);
      //await Share.open(options);
      const share = await makeApiCall('/api/v1/file-entries/' + file.id + '?_method=PUT', user?.access_token, 'post',{initialName:initialName,name :name});
        console.log('share', share.data);
        setLoading(false);
        setRefresh(!refresh)
      onClose();
      setTimeout(()=>{
        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Success',
          textBody: 'File is successfully shared!',
          button: 'close',
        })
      },1000)
      
    } catch (error) {
      console.log('Error sharing file:', error);
      setLoading(false);
    }
  };
console.log('file',file);
  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose}>
      <View style={styles.modalContent}>
        <Text style={styles.title}>Rename</Text>
        <TextInput
          style={styles.input}
          placeholder={name}
          value={name}
          onChangeText={(text) => {
            setName(text);
            if (error) setError('');
          }}
        
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TouchableOpacity style={styles.button} onPress={renameFile} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Rename</Text>}
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: 18,
    marginBottom: 12,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    width: '100%',
    paddingHorizontal: 8,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default RenameModal;
