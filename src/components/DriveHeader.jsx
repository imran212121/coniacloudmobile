import { StyleSheet, Text, View, TouchableOpacity, Dimensions  } from 'react-native'
import React , {useState} from 'react'
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Picker } from '@react-native-picker/picker';


const DriveHeader = ({ folder, handleFolderNavigation }) => {
  const { height, width } = Dimensions.get('window');
  const [selectedValue, setSelectedValue] = useState('');
  const size = 60;
  return (
    <>
    <View style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row' }}>
      {folder.map((fold, index) => {
        const isLast = folder.length === index + 1;
        if (index < 3 || isLast) {
          return (
            <View key={index} style={{}}>
              <TouchableOpacity onPress={async () => { await handleFolderNavigation(fold.id) }} style={{ margin: 10 }}>
                <Text style={{ color: 'black',paddingTop:5 }}>
                  {fold.name && fold.name.length > 10 ? fold.name.slice(0, 10) + '...' : fold.name}
                  <Text>&nbsp;&nbsp;</Text> {!isLast && <MIcon name='arrow-right'></MIcon>}
                </Text>
              </TouchableOpacity>
            </View>
          );
        } else {
          return <React.Fragment key={index}></React.Fragment>;
        }
      })}

    </View>
    <View>

    </View>
    
    </>
  )
}

export default DriveHeader

const styles = StyleSheet.create({})