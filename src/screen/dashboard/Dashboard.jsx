import { StyleSheet, ScrollView,Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import Header from '../../components/Header';
import Drive from '../../components/Drive';
import ModalView from '../../components/ModalView';
import CustomHeader from '../../components/CustomHeader';
import { AppColor } from '../../utils/AppColors';
import { useNavigation } from '@react-navigation/native';
const Dashboard = () => {
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const navigation=useNavigation()
  useEffect(() => {
    ////console.log('rnder',active,message)
  }, [active, loading])
  const modalHandler = (status, msg, isError = false) => {
    setActive(!active);
    setIsError(isError);
    setMessage(msg);
  }

  const handleLoader = (status) => {
    // console.log('status', status);
    setLoading(status);
  }
  const handleRefresh = () => {
    setRefresh(!refresh)
  }
  return (
    <>
      <Header handleRefresh={handleRefresh} refresh={refresh} loading={loading} handleLoader={handleLoader} modalHandler={modalHandler} active={active} onPress={()=>navigation.navigate('Notification')} />
 <View style={styles.mainContainer} showsVerticalScrollIndicator={false}>
     
      {/* <ModalView modalHandler={modalHandler} active={active} isError={isError} message={message} /> */}
      <Drive loading={loading} refresh={refresh} active={active} handleLoader={handleLoader} />
    </View>
    </>
   
  )
}

export default Dashboard

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F1F1F1',
    // padding:10
  },
  normelText:{
    fontSize:13,
    fontWeight:'400',
    lineHeight:19,
    color:AppColor.noermalText
  },
  BoldlText:{
fontSize:16,
fontWeight:'500',
lineHeight:24,
color:AppColor.boldText
  },
  headerTextContainer:{
    position:'absolute',
    top:0,
    left:50
  }
})