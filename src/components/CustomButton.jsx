import { StyleSheet, Text, View,TouchableOpacity } from 'react-native'
import React from 'react'
import { AppColor } from '../utils/AppColors'

const CustomButton = ({
  buttonTitle,
  onPress
}) => {
  return (
    <View>
      <TouchableOpacity>
        <View style={styles.mainContainer}>
            <Text style={styles.buttonStyle} onPress={onPress}>{buttonTitle}</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default CustomButton

const styles = StyleSheet.create({
  mainContainer:{
    width:350,
   
  },
  buttonStyle:{
    backgroundColor:AppColor.BUTTON,
    color:'white',
    paddingVertical:15,
    fontSize:18,
    textAlign:'center',
    
    borderRadius:10
  }

})