import React, { useEffect, useState } from 'react';
import makeApiCall from '../helper/apiHelper';
import { View, StyleSheet, Text } from "react-native";
import Svg, { Circle, G } from 'react-native-svg';

const StorageStatus = ({ user,usertoken }) => {
  const radius = 70;
  const [spendStorage, setSpendStorage] = useState(0);
  const [totalStorage, setTotalStorage] = useState(100);
  const [percentage, setPercentage] = useState(0);
  const [strokeDashoffset, setStrokeDashoffset] = useState(0);
  const circleCircumference = 2 * Math.PI * radius;
 

  const MBtoGB = (mb) => {
    return Math.round(mb / 1024 ** 3);
  }



  useEffect(() => {

    const fetchData = async () => {
      try {
        console.log('user?.access_token2',user?.access_token);
        const storage = await makeApiCall(`/api/v1/user/space-usage?timestamp=${new Date().getTime()}`, user?.access_token, 'get');
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
     if(usertoken!=false){fetchData();}
    //}, 200)

  }, [percentage, spendStorage,usertoken])
 
  return (
    <View style={styles.container}>
      <View style={styles.graphWrapper}>
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
});
export default StorageStatus;
