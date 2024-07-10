

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CheckBox from '@react-native-community/checkbox';

const Checkbox = ({ checked, onChange, text }) => {
  return (
    <View style={styles.checkboxContainer}>
      <CheckBox disabled={false} value={checked} onValueChange={onChange} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  text: {
    marginLeft: 10,
    color: 'black',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Checkbox;
