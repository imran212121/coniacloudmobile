import { StyleSheet, Text, View, Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { AppSettings } from '../../utils/Settings';
import { makeApiCall } from '../../helper/apiHelper';
import Sound from 'react-native-sound';
import CustomHeader from '../CustomHeader';

const AudioPreview = ({ route, navigation }) => {
  const { filePath, user } = route.params;
  const audioId = filePath.id;
  const [previewToken, setPreviewToken] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundInstance, setSoundInstance] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const accessToken = user?.access_token;

  useEffect(() => {
    const fetchAudioData = async () => {
      try {
        const tokenResponse = await makeApiCall(`/api/v1/file-entries/${audioId}/add-preview-token`, accessToken, 'post', {});
        setPreviewToken(tokenResponse?.preview_token);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching audio preview token:', error);
        setError('Error loading audio preview token.');
        setIsLoading(false);
      }
    };

    fetchAudioData();
  }, [audioId, accessToken]);

  const audioUrl = previewToken ? `${AppSettings.base_url}${filePath.url}?preview_token=${previewToken}` : null;

  useEffect(() => {
    if (audioUrl) {
      const sound = new Sound(audioUrl, Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          console.log('Failed to load the sound', error);
          setError('Unable to load audio.');
          return;
        }
        setDuration(sound.getDuration());
        setSoundInstance(sound);
      });

      return () => {
        if (soundInstance) {
          soundInstance.release(); // Release sound instance when leaving the screen
        }
      };
    }
  }, [audioUrl]);

  const togglePlayPause = () => {
    if (soundInstance) {
      if (isPlaying) {
        soundInstance.pause();
      } else {
        soundInstance.play((success) => {
          if (!success) {
            console.log('Playback failed');
            setError('Error playing audio.');
          }
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    if (isPlaying && soundInstance) {
      const interval = setInterval(() => {
        soundInstance.getCurrentTime((seconds) => setCurrentTime(seconds));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  return (
    <View style={styles.container}>
      <CustomHeader back={true} left={true} OnPress={() => navigation.goBack()} />
      <View style={styles.audiocontainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#000" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <>
            <Text style={styles.audioTitle}>Playing: {filePath.file_name}</Text>
            <TouchableOpacity style={styles.playPauseButton} onPress={togglePlayPause}>
              <Text style={styles.playPauseText}>{isPlaying ? 'Pause' : 'Play'}</Text>
            </TouchableOpacity>
            <View style={styles.progressContainer}>
              <Text>{currentTime.toFixed(2)} / {duration.toFixed(2)} seconds</Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressIndicator,
                    { width: `${(currentTime / duration) * 100}%` },
                  ]}
                />
              </View>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

export default AudioPreview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  audiocontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  playPauseButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  playPauseText: {
    color: '#fff',
    fontSize: 18,
  },
  progressContainer: {
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
  },
  progressBar: {
    height: 5,
    backgroundColor: '#ccc',
    width: '100%',
    borderRadius: 2,
    marginTop: 5,
  },
  progressIndicator: {
    height: 5,
    backgroundColor: '#007BFF',
    borderRadius: 2,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});
