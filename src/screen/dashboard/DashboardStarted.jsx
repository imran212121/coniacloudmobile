import { StyleSheet, ScrollView ,View} from 'react-native'

import React, { useState, useEffect } from 'react'
import Header from '../../components/Header';
import Started from '../../components/Started';
import ModalView from '../../components/ModalView';
import CustomHeader from '../../components/CustomHeader';
import { useNavigation } from '@react-navigation/native';

const DashboardMyfiles = () => {
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
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
    console.log('status', status);
    setLoading(status);
  }
  return (
    <>
      <View style={{padding:15}}>

        <CustomHeader back={true} left={true} right={true} title={'My Files'} grid={true} 
        OnPress={()=>navigation.goBack()}/>
      </View>
      <ScrollView style={styles.mainContainer} showsVerticalScrollIndicator={false}>
        {/* <ModalView modalHandler ={modalHandler} active={active} isError={isError} message={message}/> */}
        <Started loading={loading} active={active} handleLoader={handleLoader} />
      </ScrollView>

    </>
  )
}

export default DashboardMyfiles

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F1F1F1'
  }
})