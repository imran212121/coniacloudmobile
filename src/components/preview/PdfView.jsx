import { Dimensions, StyleSheet, View,Text } from 'react-native';
import React from 'react';
import Pdf from 'react-native-pdf';
import CustomHeader from '../CustomHeader';
import { useNavigation } from '@react-navigation/native';

const PdfView = ({ route }) => {
const navigation=useNavigation()
  console.log(route)
  const pdfUri = route.params.pdfUri;
  console.log(pdfUri)

  return (
    <View style={styles.container}>
      <CustomHeader back={true} left={true} OnPress={()=>navigation.goBack()}/>
      <Pdf
        source={{ uri: pdfUri }}
        trustAllCerts={false}
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(`Number of pages: ${numberOfPages}`);
        }}
        onError={(error) => {
          console.log(error);
        }}
        // onPressLink={(uri) => {
        //   console.log(`Link pressed: ${uri}`);
        // }}
        style={styles.pdf}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding:15
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default PdfView;
