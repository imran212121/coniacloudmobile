import { StyleSheet,ScrollView } from 'react-native'

import React ,{useState,useEffect} from 'react'
import Header from '../../components/Header';
import Started from '../../components/Started';
import ModalView from '../../components/ModalView';


const DashboardMyfiles = () => {
  const [active , setActive] = useState(false);
  const [loading , setLoading] = useState(true);
  const [message , setMessage] = useState('');
  const [isError , setIsError] = useState(false); 
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

       <Header loading={loading} handleLoader={handleLoader} modalHandler ={modalHandler} active={active}
      
       notiIcon={require('../../assets/Plus.png')}
       uploadIcon={require('../../assets/icons/fi_grid.png')}/>
    <ScrollView style={styles.mainContainer} showsVerticalScrollIndicator={false}>
       {/* <ModalView modalHandler ={modalHandler} active={active} isError={isError} message={message}/> */}
       <Started loading={loading} active={active} handleLoader={handleLoader}/>
        </ScrollView>
        </>
  )
}

export default DashboardMyfiles

const styles = StyleSheet.create({
  mainContainer:{
    flex:1,
    backgroundColor:'#F1F1F1'
  }
})