import { StyleSheet,ScrollView, View } from 'react-native'

import React ,{useState,useEffect} from 'react'
import Header from '../../components/Header';
import Started from '../../components/Started';
import ModalView from '../../components/ModalView';
import Shared from '../../components/Shared';
import CustomHeader from '../../components/CustomHeader';
import { setLanguage } from '../../redux/reducers/languageSlice'; 
import strings from '../../helper/Language/LocalizedStrings';
import { useSelector } from 'react-redux';

const DashboardShare = () => {
  const [active , setActive] = useState(false);
  const [loading , setLoading] = useState(true);
  const [message , setMessage] = useState('');
  const [isError , setIsError] = useState(false); 
  const language = useSelector((state) => state.language.language);
  useEffect(()=>{
   ////console.log('rnder',active,message)
  },[active,loading])
  const modalHandler = (status,msg,isError=false) =>{
      setActive(!active);
      setIsError(isError);
      setMessage(msg);
   }
  
  const handleLoader = (status) => {
    console.log('status',status);
    setLoading(status);
  }
  return (
    <>
     {/* <Header loading={loading} handleLoader={handleLoader} modalHandler ={modalHandler} active={active}
      
      notiIcon={require('../../assets/Plus.png')}
      uploadIcon={require('../../assets/icons/fi_grid.png')}/> */}
      <View style={{padding:15}}>

      <CustomHeader back={true} left={true} right={true} title={strings.SHARED} grid={true}/>
      </View>
   <ScrollView style={styles.mainContainer} showsVerticalScrollIndicator={false}>
      {/* <ModalView modalHandler ={modalHandler} active={active} isError={isError} message={message}/> */}
      <Shared loading={loading} active={active} handleLoader={handleLoader}/>
       </ScrollView>
       </>
  )
}

export default DashboardShare

const styles = StyleSheet.create({
  mainContainer:{
    // flex:1,
    backgroundColor:'#F1F1F1'
  }
})