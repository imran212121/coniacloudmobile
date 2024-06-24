import { StyleSheet, Text, View, Image, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native'
import { AppColor } from '../utils/AppColors';
import CustomHeader from './CustomHeader';
import Switch from './Switchcomponent';

const Data = [
  {
    id: 1,
    ImagePath: require('../assets/icon/fi_user-plus.png'),
    text: "Add Account"
  },
  {
    id: 2,
    ImagePath: require('../assets/icon/Lock.png'),
    text: "Change Password"
  },
  {
    id: 3,
    ImagePath: require('../assets/icon/fi_user-check.png'),
    text: "Account Information"
  },
  {
    id: 4,
    ImagePath: require('../assets/icon/Smallfolder.png'),
    text: "Upgrade Plan"
  },
  {
    id: 5,
    ImagePath: require('../assets/icon/smallFile.png'),
    text: "Change Language"
  },
  {
    id: 6,
    ImagePath: require('../assets/icon/SmallFile1.png'),
    text: "Terms and Condition"
  },
]

const SettingsScreen = () => {
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const profileHandler = () => {
    navigation.navigate('Profile');
  };

  return (
    <View style={{ marginTop: 2, flex: 1, flexDirection: 'column' }}>
      {loading ? (
        <View style={{ flex: 1, paddingVertical: 150, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="extra-large" color="#004181" animating={true} />
          {/* Other content */}
        </View>
      ) : (
        <>
          <View style={styles.container}>
            <CustomHeader back={true} left={true} title={'Settings'} 
            OnPress={()=>navigation.goBack()}/>
            <View style={styles.Box}>
              {Data.map((item) => (
                <TouchableOpacity key={item.id} style={{ flexDirection: 'row',marginTop:10,marginVertical:15}}>
                  <Image source={item.ImagePath} style={{ height: 30, width: 30, marginRight: 15 ,resizeMode:'contain'}} />
                  <Text style={{ fontSize: 16 }}>{item.text}</Text>
                </TouchableOpacity>
              ))}
              <View style={{flexDirection:'row',justifyContent:"space-between"}}>
                <Text style={styles.headingText}>Enable Sync</Text>
             <Switch/>
              </View>
              <View style={{flexDirection:'row',justifyContent:"space-between"}}>
              <Text style={styles.headingText}>Enable 2 Step Verification</Text>
             <Switch/>
              </View>
              <TouchableOpacity style={{marginTop:40,flexDirection:'row',alignItems:'center',gap:20}}>
                <Image source={require('../assets/icon/Logout.png')}
                style={{height:40,width:40}}/>
                <Text  style={[styles.headingText,{color:'#FF4E4E',marginTop:0}]}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </View>
  )
}

export default SettingsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColor.bgcolor,
    padding: 15
  },
  iconImage: {
    width: 20,
    height: 20,
    marginTop: 12,
    marginLeft: 9
  },
  
  loader: {
    marginTop: 10,
    alignItems: 'center',
  },
 
 
  Box: {
    width: '100%',
    height: '90%',
    backgroundColor: AppColor.white,
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
shadowOffset: {
	width: 0,
	height: 5,
},
shadowOpacity: 0.36,
shadowRadius: 6.68,

elevation: 8,
marginTop:10
  },
  headingText:{
    fontWeight:'600',
    fontSize:15,
    lineHeight:21,
    color:AppColor.noermalText,
    marginTop:14
  }
})
