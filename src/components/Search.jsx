import { View, TouchableOpacity,Image,StyleSheet,TextInput } from 'react-native'
import React , {useEffect} from 'react'

const Search = ({serach,setsearch,setpageId,setpage}) => {
  return (
    <>
      <TouchableOpacity>
              <Image source={require('../assets/Search.png')} style={styles.leftImage} />
            </TouchableOpacity>
            <TextInput style={styles.input} value={serach} onChangeText={(e)=>{
              console.log(e);
              //
              if(e?.length)
                {
                    setsearch(e);
                    setpageId('search');
                    setpage(1)
                }else{
                    console.log('******');
                    setpageId(0);
                    setpage(0);
                    setsearch(null);
                }
            }} placeholder="Search" />
            <TouchableOpacity>
              <Image source={require('../assets/Filter.png')} style={styles.rightImage} />
            </TouchableOpacity>
    </>
  )
}

export default Search
const styles = StyleSheet.create({
   
    
    
    fileText: {
      fontSize: 14,
      fontWeight: '500',
      height: 21,
      color: '#071625',
      marginTop: 20,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#ccc',
      backgroundColor: '#fff',
      borderRadius: 25,
      paddingHorizontal: 15,
      height: 45,
      width: '95%',
      alignSelf: 'center',
      marginTop: 40,
    },
    leftImage: {
      width: 24,
      height: 24,
      marginRight: 10,
    },
    input: {
      flex: 1,
      height: '100%',
    },
    rightImage: {
      width: 20,
      height: 20,
      marginLeft: 10,
    },
    
  });