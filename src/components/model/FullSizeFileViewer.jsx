import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const FullSizeFileViewer = ({data}) => {
    const route=useroute()
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/150.jpg')} style={{height:'100%',width:'100%',}}/>
    </View>
  )
}

export default FullSizeFileViewer

const styles = StyleSheet.create({
    container:{
        flex:1,
        padding:15,

    }
})