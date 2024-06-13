import { StyleSheet, Text, View,Dimensions } from 'react-native'
import React from 'react'

export default function Alertm({text,type}) {
    const deviceWidth = Dimensions.get('window').width;
  return (<>
    {(type =='error') &&
    <View style={styles.error}>
      <Text>{text}</Text>
    </View>
  }
     {(type =='success') &&
    <View style={styles.success}>
      <Text>{text}</Text>
    </View>
  }
  </>)
}

const styles = StyleSheet.create({
    error:{
      color:'#5F2120',
      backgroundColor:'#FFEDED',
      fontWeight: 400,
      fontSize: '0.875rem',
      lineHeight: 2.43,
      paddingTop:4,
      paddingBottom:4,
      paddingLeft:10,
      borderRadius:4,
      display:'flex',
      marginTop:22,
      alignContent:'center',
      height:30,
      marginLeft:10,
      width: Dimensions.get('window').width-100
    },
    success:{
        color:'#1E4620',
        backgroundColor:'#EDF7ED',
        fontWeight: 400,
        fontSize: '0.875rem',
        lineHeight: 1.43,   
        padding: '6px 16px',
        borderRadius:4
      }
})