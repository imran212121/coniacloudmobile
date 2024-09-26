import { StyleSheet, Text, View, Dimensions, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { AppSettings } from '../../utils/Settings';
import { makeApiCall } from '../../helper/apiHelper';
import Video from 'react-native-video';
import CustomHeader from '../CustomHeader';

const VideoPreview = ({ route, navigation }) => {
  const { filePath, user } = route.params;
  const videoId = filePath.id;
  const [previewToken, setPreviewToken] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const accessToken = user?.access_token;
  const deviceWidth = Dimensions.get('window').width;
  const deviceHeight = Dimensions.get('window').height;

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const tokenResponse = await makeApiCall(`/api/v1/file-entries/${videoId}/add-preview-token`, accessToken, 'post', {});
        setPreviewToken(tokenResponse?.preview_token);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching video preview token:', error);
        setError('Error loading video preview token.');
        setIsLoading(false);
      }
    };

    fetchVideoData();
  }, [videoId, accessToken]);

  // Construct video URL once the preview token is fetched
  const videoUrl = previewToken ? `${AppSettings.base_url}${filePath.url}?preview_token=${previewToken}` : null;

  return (
    <View style={styles.container}>
      <CustomHeader back={true} left={true} OnPress={() => navigation.goBack()} />
      <View style={styles.videocontainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#000" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          videoUrl ? (
            <Video
              source={{ uri: videoUrl }}
              style={styles.fullscreenVideo} // Fullscreen video styling
              controls
              resizeMode="cover"
              onError={(e) => console.log('Video Error:', e)}
            />
          ) : (
            <Text style={styles.errorText}>Unable to load video.</Text>
          )
        )}
      </View>
    </View>
  );
};

export default VideoPreview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  videocontainer: {
    flex: 1, // Make the container take up the full height
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenVideo: {
    width: Dimensions.get('window').width, // Full width
    height: Dimensions.get('window').height, // Full height
    top:30
    // position: 'absolute',
    // top:10,
    // left: 0,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});
