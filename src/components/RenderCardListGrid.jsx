import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';
import {timeAgo} from '../helper/functionHelper';
const deviceWidth = Dimensions.get('window').width;
// Dummy Icons (replace with actual imports)
import folderIcon from '../assets/icon/folder.png';
import fileIcon from '../assets/icon/file.png';
import pdfIcon from '../assets/icons/pdf.png';
import play from '../assets/icons/pdf.png';
import video from '../assets/icon/video.png';
import wordIcon from '../assets/icon/word.png';
import imageIcon from '../assets/icon/image.png';
import ModalComponent from './ModalComponent';

import {fileColorCode} from '../constant/settings';

const RenderCardListGrid = ({
  fileEntries,
  onPress,
  refreshing,
  onRefresh,
  user,
  token,
  setRefresh,
  refresh,
  isLoading,
  isGrid,
}) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [visibleShereModal, setVisible] = useState(false);

  const toggleModalVisible = item => {
    setSelectedItem(item);
    setVisible(!visibleShereModal);
  };
  const toggleHideModal = () => {
    setVisible(!visibleShereModal);
  };
  const renderItemList = ({item}) => {
    // Define file type icons
    const fileType = {
      folder: folderIcon,
      file: fileIcon,
      pdf: pdfIcon,
      word: wordIcon,
      image: imageIcon,
      jpg: imageIcon,
      jpeg: imageIcon,
      png: imageIcon,
      gif: imageIcon,
      svg: imageIcon,
      audio: play,
      video: video,
    };

    // Function to determine file type
    let fileTypeKey = 'file';
    if (item.type === 'folder') {
      fileTypeKey = 'folder';
    } else if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(item.extension)) {
      fileTypeKey = 'image';
    } else if (item.extension === 'pdf') {
      fileTypeKey = 'pdf';
    } else if (['doc', 'docx'].includes(item.extension)) {
      fileTypeKey = 'word';
    } else if (['xls', 'xlsx'].includes(item.extension)) {
      fileTypeKey = 'xls';
    } else if (['ppt', 'pptx'].includes(item.extension)) {
      fileTypeKey = 'ppt';
    } else if (['mp4', 'avi', 'mkv', 'mov', 'wmv'].includes(item.extension)) {
      fileTypeKey = 'video';
    } else if (['mp3', 'wav', 'aac', 'flac'].includes(item.extension)) {
      fileTypeKey = 'audio';
    } else if (item.extension === 'txt') {
      fileTypeKey = 'file';
    }
    return (
      <TouchableOpacity
        onPress={() => onPress(item)}
        style={[
          styles.fileData,
          {
            height: 90,

            backgroundColor: '#CFECFF',
            flexDirection: 'column',
          },
        ]}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          {/* Display the correct icon based on file type */}
          <Image source={fileType[fileTypeKey]} style={styles.itemIcon} />

          {/* More options button */}
          <View style={{position:'absolute',left:60,bottom:5}}>
            <Text style={styles.fileText}>
              {item.name.length > 15
                ? `${item.name.substring(0, 15)}...`
                : item.name}
            </Text>

            {/* Display the relative time when the file was created */}
            <Text style={styles.filetxtnormal}>{timeAgo(item.created_at)}</Text>
          </View>
          <TouchableOpacity
            // onPress={() => handleModalOpen(item)}
            onPress={() => toggleModalVisible(item)}>
            <Image
              source={require('../assets/MoreOption.png')}
              style={[
                styles.moreicon,
                {
                  height: 20,
                  width: 15,
                  tintColor:
                    fileColorCode[
                      Math.floor(Math.random() * fileColorCode.length)
                    ],
                },
              ]}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderItemGrid = ({item, index}) => {
    const fileType = {
      folder: folderIcon,
      file: fileIcon,
      pdf: pdfIcon,
      word: wordIcon,
      image: imageIcon,
      jpg: imageIcon,
      jpeg: imageIcon,
      png: imageIcon,
      gif: imageIcon,
      svg: imageIcon,
      audio: play,
      video: video,
    };
    let fileTypeKey = 'file';
    if (item.type === 'folder') {
      fileTypeKey = 'folder';
    } else if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(item.extension)) {
      fileTypeKey = 'image';
    } else if (item.extension === 'pdf') {
      fileTypeKey = 'pdf';
    } else if (['doc', 'docx'].includes(item.extension)) {
      fileTypeKey = 'word';
    } else if (['xls', 'xlsx'].includes(item.extension)) {
      fileTypeKey = 'xls';
    } else if (['ppt', 'pptx'].includes(item.extension)) {
      fileTypeKey = 'ppt';
    } else if (['mp4', 'avi', 'mkv', 'mov', 'wmv'].includes(item.extension)) {
      fileTypeKey = 'video';
    } else if (['mp3', 'wav', 'aac', 'flac'].includes(item.extension)) {
      fileTypeKey = 'audio';
    } else if (item.extension === 'txt') {
      fileTypeKey = 'file';
    }
    return (
      <TouchableOpacity
        onPress={() => onPress(item)}
        style={[
          styles.fileData,
          {
            width: deviceWidth * 0.42,
            backgroundColor: '#CFECFF',
            flexDirection: 'column',
          },
        ]}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          {/* Display the correct icon based on file type */}
          <Image source={fileType[fileTypeKey]} style={styles.itemIcon} />

          {/* More options button */}
          <TouchableOpacity
            // onPress={() => handleModalOpen(item)}
            onPress={() => toggleModalVisible(item)}>
            <Image
              source={require('../assets/MoreOption.png')}
              style={[
                styles.moreicon,
                {
                  height: 20,
                  width: 15,
                  tintColor:
                    fileColorCode[
                      Math.floor(Math.random() * fileColorCode.length)
                    ],
                },
              ]}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.fileText}>
          {item.name.length > 15
            ? `${item.name.substring(0, 15)}...`
            : item.name}
        </Text>

        {/* Display the relative time when the file was created */}
        <Text style={styles.filetxtnormal}>{timeAgo(item.created_at)}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Show a message if there are no file entries */}
      {fileEntries.length === 0 ? (
        <Text style={styles.noDataText}>No files available.</Text>
      ) : (
        <FlatList
          data={fileEntries}
          renderItem={isGrid ? renderItemGrid : renderItemList}
          numColumns={isGrid ? 2 : 1}
          keyExtractor={item => item.id.toString()}
          refreshing={refreshing}
          onRefresh={onRefresh}
          key={isGrid ? 'grid' : 'list'}
        />
      )}
      {selectedItem && (
        <ModalComponent
          isVisible={visibleShereModal}
          setModalVisible={setVisible}
          onClose={toggleHideModal}
          user={user}
          PreviewToken={token}
          item={selectedItem}
          setRefresh={setRefresh}
          refresh={refresh}
          loading={refresh}
        />
      )}
    </View>
  );
};

export default RenderCardListGrid;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: 10,
  },

  fileText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  filetxtnormal: {
    fontSize: 12,
    color: '#666',
  },
  moreicon: {
    marginLeft: 'auto',
  },
  fileIcon: {
    height: 40,
    width: 40,
    resizeMode: 'contain',
  },
  itemIcon: {
    height: 40,
    width: 40,
    resizeMode: 'contain',
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
    fontWeight: '800',
  },
  fileData: {
    margin: 8,
    height: 115,
    padding: 12,
    borderRadius: 20,
    justifyContent: 'center',
  },
  loader: {
    marginTop: 10,
    alignItems: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
  },
  paginationButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    alignItems: 'center',
    height: 40,
    marginHorizontal: 15,
  },
  paginationButtonText: {
    color: '#fff',
    fontSize: 16,
    paddingVertical: 9,
  },
  disabledButton: {
    opacity: 0.5,
  },
  noDataContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 300,
    marginLeft: 42,
  },
  noDataImage: {
    width: 300,
    height: 220,
    borderRadius: 5,
  },
  noDataText: {
    fontSize: 18,
    fontWeight: '500',
    paddingLeft: 32,
    paddingTop: 20,
  },
  fileIcon: {
    width: 30,
    height: 30,
    alignItems: 'flex-start',
  },
  fileText: {
    fontSize: 14,
    fontWeight: '500',
    // height: 21,
    color: '#071625',
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 45,
    width: '95%',
    alignSelf: 'center',
    marginTop: 40,
  },
  leftImage: {
    width: 24,
    height: 24,
    marginRight: 10,
  },

  rightImage: {
    width: 20,
    height: 20,
    marginLeft: 10,
  },
  filetxtnormal: {
    // background: '#696D70',
    fontWeight: '400',
    fontSize: 12,
  },
  moreicon: {
    height: 25,
    width: 10,
    resizeMode: 'contain',
  },
  heading: {
    fontSize: 18,
    color: '#071625',
    lineHeight: 27,
    fontWeight: '600',
  },
});
