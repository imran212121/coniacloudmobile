import React , {useState,useEffect} from 'react'; 
import { StyleSheet, View , Text , Modal , Button } from 'react-native';

const ModalView = ({active,message,isError,modalHandler}) => {
    useEffect(()=>{
        ////console.log('Render Again');
    },[active])
    //setIsVisible(active);
    
  return (
    <View style={styles.container}> 
        <Modal 
        animationType="slide"
        transparent={true} 
        visible={active} 
        onRequestClose={() => { 
          console.warn("closed"); 
        }} 
        > 
          <View style={styles.container}> 
            <View style={styles.View}> 
            <Text style={styles.text}>{message}</Text> 
            <Button title="close" 
                    onPress={()=>{
                        modalHandler(false,'',false)
                        }}/> 
            </View> 
          </View> 
        </Modal> 
       
    </View> 
  )
}

export default ModalView


const styles = StyleSheet.create({ 
    container: { 
      flex: 1, 
      backgroundColor : "black", 
      alignItems: 'center', 
      justifyContent: 'center', 
    }, 
    View : { 
      backgroundColor : "white" , 
      height : 140 , 
      width : 350, 
      borderRadius : 15, 
      alignItems : "center", 
      justifyContent : "center", 
      borderColor : "black", 
      borderWidth:2, 
    }, 
    text : { 
      fontSize : 20, 
      color : "green", 
      marginBottom:20 
    }, 
    button : { 
      margin : 20, 
      width:200, 
    } 
  }); 