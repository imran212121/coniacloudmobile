import { StyleSheet, ScrollView ,View} from 'react-native'

import React, { useState, useEffect } from 'react'
import Header from '../../components/Header';
import Started from '../../components/Started';
import MyDrive from '../../components/MyDrive';
import ModalView from '../../components/ModalView';
import CustomHeader from '../../components/CustomHeader';
import { setLanguage } from '../../redux/reducers/languageSlice'; 
import strings from '../../helper/Language/LocalizedStrings';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Trashed from '../../components/Trash';


const DashboardTrash = () => {
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const navigation=useNavigation()
  const language = useSelector((state) => state.language.language);
  useEffect(() => {
    //navigation.navigate('Login');
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

<CustomHeader back={true} left={true} right={true} title={strings.TRASH_FILE} grid={true}/>
</View>
<View style={styles.mainContainer} showsVerticalScrollIndicator={false}>
  {/* <ModalView modalHandler ={modalHandler} active={active} isError={isError} message={message}/> */}
  <Trashed loading={loading} active={active} refresh={refresh} handleLoader={handleLoader} setRefresh={setRefresh}/>
</View>
   </>

  )
}

export default DashboardTrash

const styles = StyleSheet.create({
  mainContainer:{
    flex:1,
    backgroundColor:'#F1F1F1'
  }
})