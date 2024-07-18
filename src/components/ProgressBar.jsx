import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { AppColor } from '../utils/AppColors';

const ProgressBar = ({ progress }) => {

  const animatedStyle = useAnimatedStyle(() => ({
    width: withTiming(`${progress}%`, { duration: 1000 }),
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.completion, animatedStyle]} />
    </View>
  );
};

export default ProgressBar;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignSelf: 'stretch',
    height: 10,
    backgroundColor: '#e4e4e4',
    marginTop: 10,
    borderRadius: 20,
  },
  completion: {
    position: 'absolute',
    alignSelf: 'stretch',
    height: '100%',
    backgroundColor: AppColor.BUTTON,
    borderRadius: 20,
  },
});
