import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
} from 'react-native';
import React, {useEffect} from 'react';
import strings from '../helper/Language/LocalizedStrings';

const Search = ({serach, setsearch,handleSearch}) => {
  return (
    <>
    <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>

    <View style={{flexDirection:'row',alignItems:'center'}}>

      <TouchableOpacity >
        <Image
          source={require('../assets/Search.png')}
          style={styles.leftImage}
        />
      </TouchableOpacity>
      <TextInput
        value={serach}
        onChangeText={text => {
          setsearch(text);
          handleSearch(text);
        }}
        placeholder="Search files..."
      />
      </View>
      <TouchableOpacity>
        <Image
          source={require('../assets/Filter.png')}
          style={styles.rightImage}
        />
      </TouchableOpacity>
      </View>
    </>
  );
};

export default Search;
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
