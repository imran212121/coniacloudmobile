import { StyleSheet,ScrollView } from 'react-native'

import React ,{useState,useEffect} from 'react'
import Header from '../../components/Header';
import Drive from '../../components/Drive';
import ModalView from '../../components/ModalView';


const Dashboard = () => {
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
    <ScrollView style={styles.mainContainer}>
      
       <Header loading={loading} handleLoader={handleLoader} modalHandler ={modalHandler} active={active}/>
       <ModalView modalHandler ={modalHandler} active={active} isError={isError} message={message}/>
       <Drive loading={loading} active={active} handleLoader={handleLoader}/>
        </ScrollView>

  )
}

export default Dashboard

const styles = StyleSheet.create({
  mainContainer:{
    flex:1,
    backgroundColor:'#F1F1F1'
  }
})