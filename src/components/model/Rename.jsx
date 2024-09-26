import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { AlertNotificationRoot, Dialog, ALERT_TYPE } from 'react-native-alert-notification';
import { makeApiCall } from '../../helper/apiHelper';

const RenameModal = ({ isVisible, onClose, file, user, setRefresh, onRenameSuccess, refresh }) => {
  const [initialName, setInitialName] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isVisible && file) {
      setName(file.name);
      setInitialName(file.name);
    }
  }, [isVisible, file]);

  const renameFile = async () => {
    if (name.trim() === "") {
      setError('Please enter a file name');
      return;
    }
    if (name === initialName) {
      onClose();
      return;
    }
    setError('');
    // setLoading(true);
    try {
      const response = await makeApiCall(`/api/v1/file-entries/${file.id}?_method=PUT`, user?.access_token, 'post', {
        name: name
      });

      console.log('Rename response:', response);

      if (response.status === 'success') {
        // setRefresh(true);
        refresh=(true) // Trigger refresh in parent component
        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Success',
          textBody: 'File renamed successfully!',
          button: 'close',
        });
        onRenameSuccess(); // Notify parent component to update
      } else {
        throw new Error('Failed to rename file.');
      }
    } catch (error) {
      console.error('Error renaming file:', error.message);
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'Failed to rename file. Please try again.',
        button: 'close',
      });
    } finally {
      // setLoading(false);
      onClose();
    }
  };

  return (
    <Modal isVisible={isVisible} onBackdropPress={() => {
      setName(initialName); // Reset name to initial on close
      setError(''); // Clear error on close
      onClose();
    }}>
      <View style={styles.modalContent}>
        <Text style={styles.title}>Rename File</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter new file name"
          value={name}
          onChangeText={(text) => {
            setName(text);
            if (error) setError('');
          }}
          autoFocus={true}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => {
            setName(initialName); // Reset name on cancel
            setError(''); // Clear error on cancel
            onClose();
          }}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.renameButton} onPress={renameFile} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Rename</Text>}
          </TouchableOpacity>
        </View>
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
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    width: '100%',
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    marginRight: 10,
  },
  renameButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default RenameModal;
