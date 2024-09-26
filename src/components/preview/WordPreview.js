import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { AppSettings } from '../../utils/Settings';
import { makeApiCall } from '../../helper/apiHelper';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import CustomHeader from '../CustomHeader';

const WordPreview = ({ route, navigation }) => {
  const { filePath, user } = route.params;
  const wordId = filePath.id;
  const [previewToken, setPreviewToken] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [localFilePath, setLocalFilePath] = useState('');

  const accessToken = user?.access_token;

  useEffect(() => {
    const fetchWordData = async () => {
      try {
        const tokenResponse = await makeApiCall(`/api/v1/file-entries/${wordId}/add-preview-token`, accessToken, 'post', {});
        setPreviewToken(tokenResponse?.preview_token);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching Word preview token:', error);
        setError('Error loading Word preview token.');
        setIsLoading(false);
      }
    };

    fetchWordData();
  }, [wordId, accessToken]);

  const wordUrl = previewToken ? `${AppSettings.base_url}${filePath.url}?preview_token=${previewToken}` : null;

  const downloadAndOpenWordFile = async () => {
    if (wordUrl) {
      try {
        const localFile = `${RNFS.DocumentDirectoryPath}/${filePath.file_name}`;
        const downloadOptions = {
          fromUrl: wordUrl,
          toFile: localFile,
        };
        
        const result = await RNFS.downloadFile(downloadOptions).promise;
        setLocalFilePath(localFile);
        FileViewer.open(localFile)
          .then(() => {
            // Success: Word document opened in an external app
          })
          .catch((error) => {
            console.error('Error opening Word document:', error);
            setError('Unable to open Word document.');
          });
      } catch (error) {
        console.error('Error downloading Word file:', error);
        setError('Unable to download Word file.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <CustomHeader back={true} left={true} OnPress={() => navigation.goBack()} />
      <View style={styles.wordContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#000" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <TouchableOpacity style={styles.openButton} onPress={downloadAndOpenWordFile}>
            <Text style={styles.openButtonText}>Open Word Document</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default WordPreview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  wordContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  openButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  openButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});





