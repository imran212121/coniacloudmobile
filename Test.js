import { StyleSheet, Text, View, TextInput } from 'react-native';
import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Test = () => {
  const [number, setNumber] = React.useState(0);

  const increaseNumber = () => {
    setNumber(prevNumber => prevNumber + 1);
  };

  const decreaseNumber = () => {
    setNumber(prevNumber => (prevNumber > 0 ? prevNumber - 1 : 0));
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={text => setNumber(parseInt(text) || 0)}
        value={number.toString()}
        placeholder="Enter a number"
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.button} onPress={increaseNumber}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={decreaseNumber}>
        <Text style={styles.buttonText}>-</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Test;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: 200,
    textAlign: 'center',
  },
  button: {
    height: 30,
    width: 50,
    backgroundColor: 'red',
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
  },
});
