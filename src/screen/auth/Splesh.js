import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect,useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';

const Splesh = () => {
    const navigation=useNavigation()
    useEffect(()=>{
        const timer= setTimeout(()=>{
         navigation.navigate('Login')
        },2000)
        return ()=>clearTimeout(timer)
     },[])
     

      return (
    <View>
     <Image source={require('../../assets/Splashscreen.png')}
     style={styles.logoImage}/>
    </View>
  )
}

export default Splesh

const styles = StyleSheet.create({
    container:{
        flex:1,

    },
    logoImage:{
        height:'100%',width:'100%'
    }
})