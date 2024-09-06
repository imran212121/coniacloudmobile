import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const ImageViewer = ({ route }) => {
  const { filePath } = route.params;
  console.log(filePath);

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: `file://${filePath}` }}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default ImageViewer;
