import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Alert } from 'react-native';
import Modal from 'react-native-modal';
import Checkbox from '../Checkbox';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setLanguage } from '../../redux/reducers/languageSlice';
import strings from '../../helper/Language/LocalizedStrings'; // Import your localized strings

const ChoseLanguage = () => {
  const [modalVisible, setModalVisible] = useState(true);
  const [selectedCheckboxIndex, setSelectedCheckboxIndex] = useState(null);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleCheckboxChange = (index) => {
    setSelectedCheckboxIndex(index === selectedCheckboxIndex ? null : index);
  };

  const checkboxLabels = [
    { label: 'English', value: 'eng' },
    { label: 'Turkish', value: 'tur' },
    { label: 'German', value: 'ger' },
  ];

  const closeModal = () => {
    setModalVisible(false);
    navigation.goBack();
  };

  const applyLanguage = async () => {
    if (selectedCheckboxIndex !== null) {
      const selectedLanguage = checkboxLabels[selectedCheckboxIndex].value;
      await AsyncStorage.setItem('language', selectedLanguage); // Save language to AsyncStorage
      dispatch(setLanguage(selectedLanguage));
      strings.setLanguage(selectedLanguage);

      // Show alert after successfully changing language
      Alert.alert(
        'Language Changed',
        `Language has been set to ${checkboxLabels[selectedCheckboxIndex].label}`,
        [{ text: 'OK', onPress: closeModal }]
      );
    }
  };

  useEffect(() => {
    const loadLanguage = async () => {
      const savedLanguage = await AsyncStorage.getItem('language');
      if (savedLanguage) {
        const selectedIndex = checkboxLabels.findIndex(item => item.value === savedLanguage);
        setSelectedCheckboxIndex(selectedIndex);
        dispatch(setLanguage(savedLanguage));
        strings.setLanguage(savedLanguage);
      }
    };

    loadLanguage();
  }, []);

  return (
    <Modal isVisible={modalVisible} onBackdropPress={closeModal} style={styles.modal}>
      <View style={styles.modalContainer}>
        {checkboxLabels.map((item, index) => (
          <Checkbox
            key={index}
            checked={index === selectedCheckboxIndex}
            onChange={() => handleCheckboxChange(index)}
            text={item.label}
          />
        ))}
        <TouchableOpacity style={styles.applyButton} onPress={applyLanguage}>
          <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default ChoseLanguage;

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  applyButton: {
    marginTop: 20,
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
