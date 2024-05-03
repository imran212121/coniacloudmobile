import { StyleSheet, Text, View, Image, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native'


const SettingsScreen = () => {
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    useEffect(() => {
       setTimeout(()=>{
        setLoading(false);
       },500);
    }, [])
  
   const profileHandler = () => {
       navigation.navigate('Profile');
   }
  return (
    <View style={{ marginTop: 2,flex:1,flexDirection:'column' }}>
      {loading ? (
         <View style={{ flex: 1,paddingVertical:150, justifyContent: 'center', alignItems: 'center' }}>
         <ActivityIndicator size="extra-large" color="#004181" animating={true} />
         {/* Other content */}
       </View>
        
      ):
      <>
      <View style={styles.headerBottom}>
         <Text style={styles.headerBottomText}>Settings</Text>
      </View>
      <TouchableOpacity style={styles.menuBottom} onPress={profileHandler}>
         <Image source={require('../assets/icons/profile.png')} style={styles.iconImage}/>
         <Text style={styles.menuBottomText}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuBottom}>
         <Image source={require('../assets/icons/password.png')} style={styles.iconImage}/>
         <Text style={styles.menuBottomText}>Change Password</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuBottom}>
         <Image source={require('../assets/icons/language.png')} style={styles.iconImage}/>
         <Text style={styles.menuBottomText}>Language</Text>
      </TouchableOpacity>
    
</>
      }


    </View>

  )
}

export default SettingsScreen

const styles = StyleSheet.create({
  driveContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  StatusContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewContainer: {
    width: 'auto',
    height: 'auto',
  },
  filedata: {
    backgroundColor: 'white',
    margin: 15,
    height: 100,
    alignItems: 'center',
    width: 100,
    padding: 10,
    borderRadius: 10
  },
  headerBottom: {
    height: 60,
    backgroundColor: '#F1F1F1',
    borderBottomWidth: 1,
    borderBlockColor: '#e5e7eb',
    padding:10
  },
  headerBottomText: {
    fontSize:28,
    color:'black',
    fontWeight:'800',
    
  },
  menuBottom:{
    height:50,
    backgroundColor:'#fff',
    borderRadius:8,
    borderWidth:1,
    borderColor:'#797D7F',
    margin:10,
    elevation: 5, // For Android
    shadowColor: '#797D7F', // For iOS
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    flex:1,
    flexDirection:'row'
  },
  iconImage:{
    width:20,
    height:20,
    marginTop:12,
    marginLeft:9
  },
  menuBottomText:{
    fontSize:16,
    color:'#797D7F',
    fontWeight:'500',
    paddingTop:12,
    paddingLeft:5
  },
  loader: {
    marginTop: 10,
    alignItems: 'center',
  },
  paginationContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    alignItems: 'flex-start',
    marginBottom: 10
  },

  paginationButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    alignItems: 'center',
    width: 175,
    height: 40,
    marginLeft: 15
  },
  paginationButtonText: {
    color: '#fff',
    fontSize: 16,
    paddingTop: 9
  },
  disabledButton: {
    opacity: 0.5, // Example style for disabled button
  },
})