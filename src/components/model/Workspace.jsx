import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { AlertNotificationRoot, Dialog, ALERT_TYPE } from 'react-native-alert-notification'

import { makeApiCall } from '../../helper/apiHelper';


const WorkspaceModal = ({ isVisible, onClose, user, setRefresh, refresh,parentId }) => {

    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const createFolder = async () => {
        if (name == "") {
            setError('Please enter folder name');
            return;
        }
        setError('');
        setLoading(true);
        try {

            await makeApiCall('/api/v1/folders', user?.access_token, 'post', { parentId: parentId, name: name });
            setLoading(false);
            setRefresh(!refresh)
            onClose();
            setTimeout(() => {
                Dialog.show({
                    type: ALERT_TYPE.SUCCESS,
                    title: 'Success',
                    textBody: 'Folder is successfully created!',
                    button: 'close',
                })
            }, 1000)

        } catch (error) {
            console.log('Error sharing file:', error);
            setLoading(false);
            setTimeout(() => {
                Dialog.show({
                    type: ALERT_TYPE.DANGER,
                    title: 'Warning',
                    textBody: "There are something issue.",
                    button: 'close',
                })
            }, 1000)
        }
    };

    return (
        
            <Modal isVisible={isVisible} onBackdropPress={onClose}>
                <AlertNotificationRoot>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>CreateFolder</Text>
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
                    <TouchableOpacity style={styles.button} onPress={createFolder} disabled={loading}>
                        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Create</Text>}
                    </TouchableOpacity>
                </View>
                </AlertNotificationRoot>
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

export default WorkspaceModal;
