import { StyleSheet, Text, View,TextInput } from 'react-native'
import React from 'react'

const InputBox = ({
    placeholder,
    onBlur,
    onChangeText,
    value,
    touched,
    secureTextEntry,
    keyboardType,
    maxLength,
    errors
}) => {
  return (
      <View style={styles.mainContainer}>
          <TextInput style={styles.InputContainer}
              placeholder={placeholder}
              onBlur={onBlur}
              onChangeText={onChangeText}
              value={value}
              touched={touched}
              secureTextEntry={secureTextEntry}
              keyboardType={keyboardType}
              maxLength={maxLength}

          />
          {(errors && touched && <Text style={styles.errorStyle}>{errors}</Text>)}
      </View>
  )
}

export default InputBox

const styles = StyleSheet.create({
    mainContainer: {
        height:78
    },
    InputContainer:{
        borderWidth:2,
        width:350,
        borderColor:'grey',
        borderRadius:5,
        paddingHorizontal:10
    },
    errorStyle : {
        color:'red',
        marginTop:5,
        fontSize:13,
    }
})