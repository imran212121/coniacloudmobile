import React, { useEffect,useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useDispatch , useSelector} from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import CustomHeader from '../../components/CustomHeader';
import { AppColor } from '../../utils/AppColors';
import ProgressBar from '../../components/ProgressBar';
import { logout } from '../../redux/reducers/authSlice';
import { makeApiCall } from '../../helper/apiHelper';
const Data = [
  {
    id: 3,
    ImagePath: require('../../assets/icon/fi_user-check.png'),
    text: "Account Information",
    navigate: "Profile"
  },
  {
    id: 2,
    ImagePath: require('../../assets/icon/Lock.png'),
    text: "Change Password",
    navigate: "UpdatePassword"
  },

  // {
  //   id: 4,
  //   ImagePath: require('../../assets/icon/Smallfolder.png'),
  //   text: "Upgrade Plan"
  // },
  {
    id: 5,
    ImagePath: require('../../assets/icon/smallFile.png'),
    text: "Change Language"
  },
  // {
  //   id: 6,
  //   ImagePath: require('../../assets/icon/SmallFile1.png'),
  //   text: "Terms and Condition"
  // },
]

const UserProfile = () => {
  const navigation = useNavigation();
  const dispacth = useDispatch();
  const { user } = useSelector((state) => state.auth);
 
  const [spendStorage, setSpendStorage] = useState(0);
const [token, setToken] = useState(null);
  
  const [totalStorage, setTotalStorage] = useState(100);
  const [percentage, setPercentage] = useState(0);
  useEffect(() => {
    const checkLoginStatus = async () => {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (user && user.access_token) {
        setToken(user.access_token);
      }else{
        navigation.navigate('Login');
      }
    };
    checkLoginStatus();
  }, []);
  useEffect(() => {

    const fetchData = async () => {
      try {
         console.log('user?.access_token2',user?.access_token);
        const storage = await makeApiCall(`/api/v1/user/space-usage?timestamp=${new Date().getTime()}`, user?.access_token, 'get');
        setSpendStorage(MBtoGB(storage?.used));
        let per = (storage?.used / storage?.available) * 100;
        setTotalStorage(MBtoGB(storage?.available));
        setPercentage(per);
        //  console.log(per*(1800/100))
        let sdo = circleCircumference - (circleCircumference * per) / 100;
        setStrokeDashoffset(sdo);
        

      } catch (error) {
        console.error('Error fetching storage data:', error);
        //fetchData();
      }
    };
    if(user?.access_token!==undefined){
      fetchData();
    }
    

  }, [percentage, spendStorage,user?.access_token])
  const MBtoGB = (mb) => {
    return Math.round(mb / 1024 ** 3);
  }


  const logoutHandler = () => {
    dispacth(logout())
  }
  return (
    <View style={styles.container}>
      <CustomHeader back={true} left={true} right={true} />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 25 }}>
        <View style={styles.profileImageContainer}>
          {/* <Image
            source={require('../../assets/Ellipse.png')}
            style={styles.profileImage}
          /> */}
          <Image source={{ uri: user?.avatar }} style={styles.avatar} />
        </View>
        <View>
          <Text style={styles.Heading}>{user?.display_name}</Text>
          {/* <Text style={styles.normaltext}>1234 files - 32 folders</Text> */}
        </View>
      </View>
      <Text style={[styles.Heading, { lineHeight: 27, fontSize: 18, marginTop: 40 }]}>
      {spendStorage} GB of {totalStorage} GB used
      </Text>
      <ProgressBar percentage={percentage}/>
      <View style={{ marginTop: 30 }}>
        {/* <CustomButton buttonTitle={'Upgrade Storage Space'} /> */}
      </View>
      {Data.map((item) => (
                <TouchableOpacity key={item.id} 
                style={{ flexDirection: 'row',marginTop:10,marginVertical:15}} 
                onPress={()=>{
                  navigation.navigate(item.navigate);
                }}>
                  <Image source={item.ImagePath} style={{ height: 25, width: 25, marginRight: 15 ,resizeMode:'contain'}} />
                  <Text style={{ fontSize: 14,color:'#696D70',fontWeight:"400" }}>{item.text}</Text>
                </TouchableOpacity>
              ))}
     <TouchableOpacity onPress={logoutHandler} style={{marginTop:40,flexDirection:'row',alignItems:'center',gap:20}}>
                <Image source={require('../../assets/icon/Logout.png')}
                style={{height:30,width:30}}/>
                <Text  style={[styles.headingText,{color:'#FF4E4E',marginTop:0}]}>Logout</Text>
              </TouchableOpacity>
    </View>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: AppColor.bgcolor,
  },
  profileImageContainer: {
    height: 60,
    width: 60,
    backgroundColor: 'red',
    borderRadius: 50,
  },
 
    avatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginTop: 0,
      marginLeft: 0,
    },
 
  Heading: {
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 24,
    color: AppColor.noermalText,
  },
  normaltext: {
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 18,
    color: '#696D70',
  },
  Box: {
    flexDirection: 'row',
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: AppColor.white,
    height: 70,
    alignItems: 'center',
    borderRadius: 15,
    marginTop: 20,
  },
});
