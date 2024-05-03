import { StyleSheet, Text, View } from 'react-native'
import React from 'react';
import ImagePreview from './ImagePreview';

export default function Preview({selectedFile,user,closeFile,handleFolderNavigation,folderId}) {
    let content;
//console.log('selectedFile',selectedFile);
  switch (selectedFile.type) {
    case 'image':
      content = <ImagePreview handleFolderNavigation={handleFolderNavigation} files={selectedFile} folderId={folderId} closeFile={closeFile} user={user}/>;
      break;
    case 'case2':
      content = <Text>Content for Case 2</Text>;
      break;
    case 'case3':
      content = <Text>Content for Case 3</Text>;
      break;
    default:
      content = <Text>File is not suporting</Text>;
  }
  return (
    
    <View>
      {content}
    </View>
  )
}

const styles = StyleSheet.create({})