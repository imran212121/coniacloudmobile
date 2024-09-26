import { StyleSheet, Text, View, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { AppSettings } from '../../utils/Settings';
import { makeApiCall } from '../../helper/apiHelper';
import RNFS from 'react-native-fs';
import CustomHeader from '../CustomHeader';

const TextFilePreview = ({ route, navigation }) => {
  const { filePath, user } = route.params;
  const textFileId = filePath.id;
  const [previewToken, setPreviewToken] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fileContent, setFileContent] = useState('');

  const accessToken = user?.access_token;

  useEffect(() => {
    const fetchTextFileData = async () => {
      try {
        const tokenResponse = await makeApiCall(`/api/v1/file-entries/${textFileId}/add-preview-token`, accessToken, 'post', {});
        setPreviewToken(tokenResponse?.preview_token);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching text file preview token:', error);
        setError('Error loading text file preview token.');
        setIsLoading(false);
      }
    };

    fetchTextFileData();
  }, [textFileId, accessToken]);

  const textFileUrl = previewToken ? `${AppSettings.base_url}${filePath.url}?preview_token=${previewToken}` : null;

  const downloadAndReadTextFile = async () => {
    if (textFileUrl) {
      try {
        const localFile = `${RNFS.DocumentDirectoryPath}/${filePath.file_name}`;
        const downloadOptions = {
          fromUrl: textFileUrl,
          toFile: localFile,
        };

        await RNFS.downloadFile(downloadOptions).promise;
        const content = await RNFS.readFile(localFile, 'utf8');
        setFileContent(content);
      } catch (error) {
        console.error('Error downloading or reading text file:', error);
        setError('Unable to download or read text file.');
      }
    }
  };

  useEffect(() => {
    if (textFileUrl) {
      downloadAndReadTextFile();
    }
  }, [textFileUrl]);

  return (
    <View style={styles.container}>
      <CustomHeader back={true} left={true} OnPress={() => navigation.goBack()} />
      <View style={styles.textContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#000" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <ScrollView>
            <Text style={styles.fileContent}>{fileContent}</Text>
          </ScrollView>
        )}
      </View>
    </View>
  );
};

export default TextFilePreview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});
