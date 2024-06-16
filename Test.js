import React, { useEffect, useState } from 'react';
import { Animated, View, StyleSheet } from 'react-native';

const CustomSemiCircleProgress = () => {
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
    const percentage = 10; // default percentage

    return Math.max(Math.min(percentage, 100), 0);
  };

  const circleRadius = 75;
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
              outputRange: ['0deg', '1080deg']
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
    <View style={[defaultStyles.exteriorCircle, styles.exteriorCircle]}>
      <View style={[defaultStyles.rotatingCircleWrap, styles.rotatingCircleWrap]}>
        <Animated.View style={[defaultStyles.rotatingCircle, styles.rotatingCircle]} />
      </View>
      <View style={[defaultStyles.interiorCircle, styles.interiorCircle]}>
        {/* Render children here if needed */}
      </View>
    </View>
  );
};

export default CustomSemiCircleProgress;

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
  }
});
