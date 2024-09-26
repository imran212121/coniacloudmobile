import { Dimensions, StyleSheet, View,Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import Pdf from 'react-native-pdf';
import CustomHeader from '../CustomHeader';
import { useNavigation } from '@react-navigation/native';
import { AppSettings } from '../../utils/Settings';
import { makeApiCall } from '../../helper/apiHelper';

const PdfView = ({ route }) => {
  const navigation = useNavigation();

  const accesstoken = route.params?.user?.access_token;
  const pdfUri = route.params.filePath;
  const pdfId = route.params.filePath.id;
  const [previewToken, setPreviewToken] = useState('');
  const [pdfSource, setPdfSource] = useState(null);

  // Fetch the preview token
  const fetchImageData = async () => {
    try {
      const token = await makeApiCall(`/api/v1/file-entries/${pdfId}/add-preview-token`, accesstoken, 'post');
      setPreviewToken(token?.preview_token);
    } catch (error) {
      console.log('Error fetching preview token:', error);
    }
  };

  // Update pdfSource once the preview token is available
  useEffect(() => {
    if (previewToken) {
      const previewUrl = `${AppSettings.base_url}${pdfUri.url}?preview_token=${previewToken}`;
      setPdfSource({ uri: previewUrl });
      console.log('PDF source set to:', previewUrl);
    }
  }, [previewToken]);

  // Fetch token when component mounts
  useEffect(() => {
    fetchImageData();
  }, []);

  return (
    <View style={styles.container}>
      <CustomHeader back={true} left={true} OnPress={() => navigation.goBack()} />
      {pdfSource ? (
        <Pdf
          source={pdfSource}
          trustAllCerts={false}
          onLoadComplete={(numberOfPages, filePath) => {
            // console.log(`Number of pages: ${numberOfPages}`);
          }}
          onError={(error) => {
            console.log('Error loading PDF:', error);
          }}
          style={styles.pdf}
        />
      ) : (
        <View>
          <Text>Loading PDF...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default PdfView;
