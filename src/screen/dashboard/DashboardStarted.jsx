import { StyleSheet, ScrollView ,View} from 'react-native'

import React, { useState, useEffect } from 'react'
import Header from '../../components/Header';
import Started from '../../components/Started';
import MyDrive from '../../components/MyDrive';
import ModalView from '../../components/ModalView';
import CustomHeader from '../../components/CustomHeader';
import { useNavigation } from '@react-navigation/native';
import { setLanguage } from '../../redux/reducers/languageSlice'; 
import strings from '../../helper/Language/LocalizedStrings';
import { useSelector } from 'react-redux';
const DashboardMyfiles = () => {
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const language = useSelector((state) => state.language.language);
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
  return (
    <>
      <View style={{padding:15}}>

        <CustomHeader back={true} left={true} right={true} title={strings.RECENTLY_EDITED} grid={true} 
        OnPress={()=>navigation.goBack()}/>
      </View>
      <View style={styles.mainContainer} showsVerticalScrollIndicator={false}>
        {/* <ModalView modalHandler ={modalHandler} active={active} isError={isError} message={message}/> */}
        <MyDrive loading={loading} active={active} refresh={refresh} handleLoader={handleLoader} setRefresh={setRefresh}/>
      </View>

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