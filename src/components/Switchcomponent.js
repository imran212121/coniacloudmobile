import { StyleSheet, Text, View } from 'react-native'
import React,{useState} from 'react'
import { Switch } from 'react-native-switch';
const Switchcomponent = () => {
  const [checked, setChecked] = useState(false);
  const toggleSwitch = () => {
    setChecked(!checked);
  };
  
  return (
    
    <View style={styles.view}>
    <Switch
    value={!checked}
    onValueChange={toggleSwitch}
    disabled={false}
    activeText={'On'}
    inActiveText={'Off'}
    circleSize={28}
    barHeight={28}
    circleBorderWidth={3}
    backgroundActive={'#004181'}
    backgroundInactive={'#004181'}
    circleActiveColor={'white'}
    circleInActiveColor={'white'}
    changeValueImmediately={true} 
    innerCircleStyle={{ alignItems: "center", justifyContent: "center" }} 

    renderActiveText={false}
    renderInActiveText={false}
    switchLeftPx={2}
    switchRightPx={2}
    switchWidthMultiplier={2} 
    switchBorderRadius={30} 
     />
   </View>
  
  )
}

export default Switchcomponent

const styles = StyleSheet.create({
  view: {
    margin: 10,
  },
})