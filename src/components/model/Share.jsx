import React, { useState } from 'react';
import { View, Text, TextInput, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { AlertNotificationRoot, Dialog, ALERT_TYPE } from 'react-native-alert-notification'
//import { makeApiCall } from '../helper/apiHelper';
import { makeApiCall } from '../../helper/apiHelper';
//makeApiCallWithHeader
//import Share from 'react-native-share';

const ShareFileModal = ({ isVisible, onClose, file,user }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };
  const shareFile = async () => {
    if (!validateEmail(email)) {
        setError('Please enter a valid email address');
        return;
      }
      setError('');
      setLoading(true);
    try {
       
      //await Share.open(options);
      const share = await makeApiCall('/api/v1/file-entries/' + file.id + '/share', user?.access_token, 'post',{emails:[email],permissions :["edit","download"]});
        console.log('share', share.data);
        setLoading(false);
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

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose}>
      <View style={styles.modalContent}>
        <Text style={styles.title}>Share {file?.name}</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter email address"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (error) setError('');
          }}
          keyboardType="email-address"
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TouchableOpacity style={styles.button} onPress={shareFile} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Share</Text>}
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

export default ShareFileModal;
