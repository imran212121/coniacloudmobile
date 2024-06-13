import { StyleSheet, Text, View } from 'react-native'
import React from 'react';
import ImagePreview from './ImagePreview';
import VideoPreview from './VideoPreview';
import AudioPreview from './AudioPreview';
import PdfPreview from './PdfPreview';
import TextPreview from './TextPreview';

export default function Preview({selectedFile,user,closeFile,handleFolderNavigation,folderId}) {
    let content;
console.log('selectedFile',selectedFile.type);
  switch (selectedFile.type) {
    case 'image':
      content = <ImagePreview handleFolderNavigation={handleFolderNavigation} files={selectedFile} folderId={folderId} closeFile={closeFile} user={user}/>;
      break;
       case 'pdf':
       content = <PdfPreview handleFolderNavigation={handleFolderNavigation} files={selectedFile} folderId={folderId} closeFile={closeFile} user={user}/>;
       break;
    // case 'text':
      case 'video':
        content = <VideoPreview handleFolderNavigation={handleFolderNavigation} files={selectedFile} folderId={folderId} closeFile={closeFile} user={user}/>;
        break;
        case 'audio':
          content = <AudioPreview  handleFolderNavigation={handleFolderNavigation} files={selectedFile} folderId={folderId} closeFile={closeFile} user={user}/>;
          break;
          case 'text':
          content = <TextPreview  handleFolderNavigation={handleFolderNavigation} files={selectedFile} folderId={folderId} closeFile={closeFile} user={user}/>;
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