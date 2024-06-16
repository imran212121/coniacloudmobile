import React, { useEffect, useState } from 'react';
import {makeApiCall} from '../helper/apiHelper';
import { View, StyleSheet, Text } from "react-native";
import Svg, { Circle, G } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
 
  return (
    <View style={styles.container}>
      {/* <View style={styles.graphWrapper}>
        <Svg height="160" width="160" viewBox="0 0 180 180">
          <G rotation={-90} originX="90" originY="90">
            <Circle
              cx="50%"
              cy="50%"
              r={radius}
              stroke="#004181"
              fill="transparent"
              strokeWidth="20"
            />
            <Circle
              cx="50%"
              cy="50%"
              r={radius}
              stroke="red"
              fill="transparent"
              strokeWidth="20"
              strokeDasharray={circleCircumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </G>
        </Svg>
        <Text style={styles.text}>{spendStorage}GB/{totalStorage}GB</Text>
      </View> */}
      <View style={styles.halfTireCircle}>
      <View style={styles.topHalf} />
      <View style={styles.innerCircle} />
      
    </View>
    <View style={styles.bottomBox} >
        <Text style={styles.bottomBoxText}>{spendStorage}gb</Text>
        <Text style={styles.bottomBoxTextInner}>of {totalStorage}gb storage used</Text>


      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection:'column',
    marginTop:10
  },
  bottomBox:{
    marginBottom:15,
    width: 200, // Outer width
    height: 70, // Half of the outer width
    backgroundColor: 'white', // Outer color
  },
  bottomBoxText:{
    fontWeight:'600',
    fontSize:20,
    height:35,
    color:'#004181',
    textAlign:'center'
  },
  bottomBoxTextInner:{
    fontWeight:'400',
    fontSize:12,
    height:18,
    color:'#004181',
    textAlign:'center'
  },
  graphWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    position: "absolute",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 18,
    color: "#394867",
  },
  halfTireCircle: {
    position: 'relative',
    width: 200, // Outer width
    height: 100, // Half of the outer width
    backgroundColor: '#e0e1e3', // Outer color
    borderTopLeftRadius: 100, // Half of the outer width
    borderTopRightRadius: 100, // Half of the outer width
    overflow: 'hidden',
  },
  topHalf: {
    position: 'absolute',
    top: 0,
    left: 0,
    
    width: '10%', // Full width of the outer element
    height: '100%', // Half the height of the outer element
    backgroundColor: '#004181', // Top half color
    borderTopLeftRadius: 100, // Half of the outer width
    borderTopRightRadius: 100, // Half of the outer width
  },
  innerCircle: {
    position: 'absolute',
    top: 16, // Adjust for inner circle's top position
    left: 19, // Adjust for inner circle's left position
    width: 160, // Inner width (outer width - 2 * top/left positions)
    height: 90, // Half of the inner width
    backgroundColor: 'white', // Inner color
    borderTopLeftRadius: 90, // Half of the inner width
    borderTopRightRadius: 90, // Half of the inner width
  },
});
export default StorageStatus;
