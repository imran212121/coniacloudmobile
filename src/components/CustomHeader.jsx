import { Image, StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import React from 'react';
import { AppColor } from '../utils/AppColors';
import { useSelector } from 'react-redux';

const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

const CustomHeader = ({ title, left, right, back, OnPress, textcolor, bgColor, grid, hadleGidList, ViewType }) => {
  // console.log('----',hadleGidList)
  const language = useSelector((state) => state.language.language);

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={styles.leftContainer}>
        {left && (
          <TouchableOpacity style={styles.iconContainer} onPress={OnPress}>
            <Image 
              source={back ? require('../assets/icons/back.png') : require('../assets/Ellipse.png')} 
              style={{ height: 25, width: 25 }} 
              tintColor={textcolor ? AppColor.white : AppColor.black} 
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.centerContainer}>
        {title && (
          <Text style={[styles.text, { color: textcolor ? AppColor.white : AppColor.black }]}>
            {title}
          </Text>
        )}
      </View>

      <View style={styles.rightContainer}>
        {right && (
          <View style={styles.iconContainer}>
            {grid && (
              <TouchableOpacity style={styles.iconContainer} onPress={hadleGidList}>
                <Image
                  source={ViewType 
                    ? require('../assets/icons/fi_grid.png') 
                    : require('../assets/list.png')}
                  style={[styles.icon, { right: 30 }]}
                  tintColor={textcolor ? AppColor.white : AppColor.black}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.iconContainer}>
              <Image
                source={require('../assets/icons/fi_plus.png')}
                style={[styles.icon, { right: 20 }]}
                tintColor={textcolor ? AppColor.white : AppColor.black}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  text: {
    fontSize: 26,
    color: AppColor.black,
    fontWeight: '600'
  },
  iconContainer: {
    width: Width * 0.06,
    height: Height * 0.038,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  icon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  leftContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerContainer: {},
  rightContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
});
