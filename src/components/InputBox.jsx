import React, { useState } from 'react'
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import { AppColor } from '../utils/AppColors';
const InputBox = ({
  placeholder,
  onBlur,
  onChangeText,
  value,
  touched,
  secureTextEntry,
  keyboardType,
  maxLength,
  errors,
  secure,
  icon // Add icon prop to pass the icon image
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible)
  }
  const [showEye, setShowEye] = React.useState(false);

  const handleEye = () => {
    setShowEye(!showEye);
  };
  return (
    <View style={styles.mainContainer}>
      <View style={styles.inputWrapper}>
        {icon && <Image source={icon} style={styles.iconStyle} />}
        <TextInput
          style={styles.inputContainer}
          placeholder={placeholder}
          onBlur={onBlur}
          onChangeText={onChangeText}
          value={value}
          secureTextEntry={secure && !showEye}
          keyboardType={keyboardType}
          maxLength={maxLength}
        />
        {secureTextEntry ?
         (
            <Icon
              name={showEye ? 'eye' : 'eye-slash'}
              size={20}
              style={[styles.iconStyle1,]}
              color={AppColor.faint}
              onPress={handleEye}
            />
          ) : null}
        
      </View>
      {errors && touched && <Text style={styles.errorStyle}>{errors}</Text>}
    </View>
  )
}

export default InputBox

const styles = StyleSheet.create({
  mainContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'grey',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  iconStyle: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  inputContainer: {
    flex: 1,
    paddingVertical: 10,
  },
  eyeIconStyle: {
    width: 20,
    height: 20,
    marginLeft: 10,
  },
  errorStyle: {
    color: 'red',
    marginTop: 5,
    fontSize: 13,
  },
})
