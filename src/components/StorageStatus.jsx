import React, { useEffect, useState } from 'react';
import {makeApiCall} from '../helper/apiHelper';
import { View, StyleSheet, Text, Animated, } from "react-native";
import Svg, { Circle, G } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppColor } from '../utils/AppColors';
const StorageStatus = ({ user,usertoken }) => {
  const radius = 70;
  const [spendStorage, setSpendStorage] = useState(0);
  const [token, setToken] = useState(null);
  const [totalStorage, setTotalStorage] = useState(100);
  const [percentage, setPercentage] = useState(0);
  const [strokeDashoffset, setStrokeDashoffset] = useState(0);
  const circleCircumference = 2 * Math.PI * radius;
  useEffect(() => {
    const checkLoginStatus = async () => {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (user && user.access_token) {
        setToken(user.access_token);
      }
    };
    checkLoginStatus();
  }, []);

  const MBtoGB = (mb) => {
    return Math.round(mb / 1024 ** 3);
  }



  useEffect(() => {

    const fetchData = async () => {
      try {
        console.log('user?.access_token2',user?.access_token);
        const storage = await makeApiCall(`/api/v1/user/space-usage?timestamp=${new Date().getTime()}`, token, 'get');
        setSpendStorage(MBtoGB(storage?.used));
        let per = (storage?.used / storage?.available) * 100;
        setTotalStorage(MBtoGB(storage?.available));
        setPercentage(per);
        // console.log(per)
        let sdo = circleCircumference - (circleCircumference * per) / 100;
        setStrokeDashoffset(sdo);
        

      } catch (error) {
        console.error('Error fetching storage data:', error);
        //fetchData();
      }
    };
    console.log('usertoken',usertoken);
   // setTimeout(() => {
     if(token!=null){fetchData();}
    //}, 200)

  }, [percentage, spendStorage,token])

  const [rotationAnimation, setRotationAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    animate();
  }, []);

  const animate = () => {
    const toValue = getPercentage();
    const speed = 2; // default animation speed

    Animated.spring(rotationAnimation, {
      toValue,
      speed,
      useNativeDriver: true
    }).start();
  };

  const getPercentage = () => {
    const percentage = 10;

    return Math.max(Math.min(percentage, 100), 0);
  };

  const circleRadius = 95;
  const progressWidth = 30;
  const progressShadowColor = "#E1E2E4";
  const progressColor = "#ECA20F";
  const interiorCircleColor = "#FFFFFF";

  const getStyles = () => {
    const interiorCircleRadius = circleRadius - progressWidth;

    return StyleSheet.create({
      exteriorCircle: {
        width: circleRadius * 2,
        height: circleRadius,
        borderRadius: circleRadius,
        backgroundColor: progressShadowColor,
       
      },
      rotatingCircleWrap: {
        width: circleRadius * 2,
        height: circleRadius,
        top: circleRadius
      },
      rotatingCircle: {
        width: circleRadius * 2,
        height: circleRadius,
        borderRadius: circleRadius,
        backgroundColor: progressColor,
        transform: [
          { translateY: -circleRadius / 2 },
          {
            rotate: rotationAnimation.interpolate({
              inputRange: [0, 100],
              outputRange: ['0deg', '500deg']
            })
          },
          { translateY: circleRadius / 2 }
        ]
      },
      interiorCircle: {
        width: interiorCircleRadius * 2,
        height: interiorCircleRadius,
        borderRadius: interiorCircleRadius,
        backgroundColor: interiorCircleColor,
        top: progressWidth
      }
    });
  };

  const styles = getStyles();

 
  return (
    <>
    <View style={[defaultStyles.exteriorCircle, styles.exteriorCircle]}>
    <View style={[defaultStyles.rotatingCircleWrap, styles.rotatingCircleWrap]}>
      <Animated.View style={[defaultStyles.rotatingCircle, styles.rotatingCircle]} />
    </View>
    <View style={[defaultStyles.interiorCircle, styles.interiorCircle]}>
      
    </View>
  </View>
    <View style={defaultStyles.sizeContainer}>
      <Text style={defaultStyles.Heading}>{totalStorage} gb</Text>
      <Text style={{fontSize:14,textAlign:'center'}}>of 100gb storage used.</Text>
    </View>
    </>
  );
};


const defaultStyles = StyleSheet.create({
  exteriorCircle: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    alignItems: 'center',
    overflow: 'hidden'
  },
  rotatingCircleWrap: {
    position: 'absolute',
    left: 0
  },
  rotatingCircle: {
    position: 'absolute',
    top: 0,
    left: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  interiorCircle: {
    overflow: 'hidden',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  Heading:{
    fontSize:20,
    color:'#004181',
    fontWeight:'600',
    lineHeight:30,
    textAlign:'center'
  },
  sizeContainer:{
    height:80,width:190,
    backgroundColor:AppColor.white,
    shadowColor: "#000",
shadowOffset: {
	width: 0,
	height: 6,
},
shadowOpacity: 0.39,
shadowRadius: 8.30,

elevation: 13,
  }
});
export default StorageStatus;