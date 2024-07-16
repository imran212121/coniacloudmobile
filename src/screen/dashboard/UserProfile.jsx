import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomHeader from '../../components/CustomHeader';
import { AppColor } from '../../utils/AppColors';
import ProgressBar from '../../components/ProgressBar';
import CustomButton from '../../components/CustomButton';
import Switchcomponent from '../../components/Switchcomponent';
import { useSelector } from 'react-redux';
import { makeApiCall } from '../../helper/apiHelper';
import { setLanguage } from '../redux/reducers/languageSlice'; 
import strings from '../../helper/Language/LocalizedStrings';

const data = [
  {
    id: 1,
    ImgePath: require('../../assets/icons/Right.png'),
    text: strings.STORAGE_MANAGEMENT,
  },
  {
    id: 2,
    ImgePath: require('../../assets/icons/Right.png'),
    text: strings.STARED_FILES,
  },
  {
    id: 3,
    ImgePath: require('../../assets/icons/Right.png'),
    text: strings.NOTIFICATION,
  },
];

const UserProfile = () => {
  const radius = 70;
  const [user, setUser] = useState(null);
  const [totalStorage, setTotalStorage] = useState(100);
  const [percentage, setPercentage] = useState(0);
  const language = useSelector((state) => state.language.language);
  const [strokeDashoffset, setStrokeDashoffset] = useState(0);
  const [spendStorage, setSpendStorage] = useState(0);
  const [token, setToken] = useState(null);
  const circleCircumference = 2 * Math.PI * radius;
  const MBtoGB = (mb) => {
    return Math.round(mb / 1024 ** 3);
  }
  useEffect(() => {
    const checkLoginStatus = async () => {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (user && user.access_token) {
        setToken(user.access_token);
      }
    };
    checkLoginStatus();
  }, []);


  useEffect(() => {

    const fetchData = async () => {
      try {
        //  console.log('user?.access_token2',user?.access_token);
        const storage = await makeApiCall(`/api/v1/user/space-usage?timestamp=${new Date().getTime()}`, token, 'get');
        setSpendStorage(MBtoGB(storage?.used));
        let per = (storage?.used / storage?.available) * 100;
        // console.log('-------',per)
        setTotalStorage(MBtoGB(storage?.available));
        setPercentage(per);
          // console.log(per*(1800/100))
        let sdo = circleCircumference - (circleCircumference * per) / 100;
        setStrokeDashoffset(sdo);
        

      } catch (error) {
        console.error('Error fetching storage data:', error);
        //fetchData();
      }
    };
    // console.log('usertoken',usertoken);
   // setTimeout(() => {
     if(token!=null){fetchData();}
    //}, 200)

  }, [percentage, spendStorage,token])

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userData = JSON.parse(await AsyncStorage.getItem('user'));
        // console.log('Fetched user data from AsyncStorage:', userData);
        if (userData && userData.access_token) {
          setUser(userData);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
    // console.log('User state updated:', user);
  }, [user]);

  return (
    <View style={styles.container}>
      <CustomHeader back={true} left={true} right={true} />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 25 }}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: user?.avatar }}
            style={styles.profileImage}
          />
        </View>
        <View>
          <Text style={styles.Heading}>{user?.display_name}</Text>
          <Text style={styles.normaltext}>1234 files - 32 folders</Text>
        </View>
      </View>
      <Text style={[styles.Heading, { lineHeight: 27, fontSize: 18, marginTop: 40 }]}>
      {spendStorage} GB of {totalStorage} {strings.GB_USED}
      </Text>
      <ProgressBar progress={percentage}/>
      <View style={{ marginTop: 30 }}>
        <CustomButton buttonTitle={strings.UPGRADE_STORAGE_SPACE}/>
      </View>
      {data.map((item) => (
        <TouchableOpacity style={styles.Box} key={item.id}>
          <Text>{item.text}</Text>
          <Image
            source={item.ImgePath}
            style={{ height: 15, width: 15, resizeMode: "contain" }}
          />
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={styles.Box}>
      <Text>{strings.USE_DATA_FOR_FILE_TRANSFER}</Text>
        <Switchcomponent />
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
  profileImage: {
    height: '100%',
    width: '100%',
    borderRadius:40
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
