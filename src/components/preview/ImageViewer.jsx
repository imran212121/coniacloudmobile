import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet,Text } from 'react-native';
import { AppSettings } from '../../utils/Settings';
import { makeApiCall } from '../../helper/apiHelper';
import CustomHeader from '../CustomHeader';
import { useNavigation } from '@react-navigation/native';

const ImageViewer = ({ route }) => {
  const { filePath, user } = route.params;
  const accesstoken = user?.access_token;
  const ImageId = filePath.id;
  const navigation=useNavigation()

  const [previewToken, setPreviewToken] = useState('');
  const [ImageSource, setImageSource] = useState(null);

  const fetchImageData = async () => {
    try {
      const token = await makeApiCall(`/api/v1/file-entries/${ImageId}/add-preview-token`, accesstoken, 'post');
      setPreviewToken(token?.preview_token);
    } catch (error) {
      console.log('Error fetching preview token:', error);
    }
  };

  useEffect(() => {
    if (previewToken) {
      const previewUrl = `${AppSettings.base_url}${filePath.url}?preview_token=${previewToken}`;
      setImageSource({ uri: previewUrl });
      console.log('Image source set to:', previewUrl);
    }
  }, [previewToken]);

  useEffect(() => {
    fetchImageData();
  }, []);

  return (
    <View style={styles.container}>
     

        <CustomHeader back={true} left={true} OnPress={() => navigation.goBack()} />
     
      {ImageSource ? (
        <Image
          source={ImageSource}
          style={styles.image}
          resizeMode="contain"
        />
      ) : (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading image...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#fff',
  padding:15
   
  },
  image: {
    width: '100%',
    // height:600,
    resizeMode:'contain',
    height: '100%',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ImageViewer;
