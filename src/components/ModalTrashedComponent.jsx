import React, { useCallback, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Button } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import ShareFileModal from './model/Share';
import RenameModal from './model/Rename';
import { downloadFile, getDownloadPermissionAndroid } from '../helper/downloadHelper';
import RNFetchBlob from 'rn-fetch-blob';
import { AppSettings } from '../utils/Settings';
import { makeApiCall } from '../helper/apiHelper';

const ModalTrashedComponent = ({ isVisible, onClose, item, user, PreviewToken, setRefresh, refresh, setModalVisible }) => {
  const [isShareModalVisible, setShareModalVisible] = useState(false);
  const [isRenameModalVisible, setRenameModalVisible] = useState(false);
  const bottomSheetRef = useRef(null);
  const handleClosePress = () => bottomSheetRef.current.close()
  const handleSheetChanges = useCallback(
    (index) => {
      console.log('handleSheetChanges', index);
      if (index === -1) {
        onClose();
      }
    },
    [onClose]
  );

  const items = [
    { id: 6, ImagePath: require('../assets/Modalicon/Link.png'), text: 'Copy link' },

    { id: 9, ImagePath: require('../assets/Modalicon/fi_edit-2.png'), text: 'Rename' },

  ];
  const sharePopup = () => {
    console.log('k');
    setShareModalVisible(true);
  }
  const toggleModal = () => {
    setShareModalVisible(!isShareModalVisible);
  };
  const toggleRenameModal = () => {
    setRenameModalVisible(!isRenameModalVisible)
  };

  const deleteFile = async () => {
    let data = {
      entryIds: [item?.id],
      deleteForever: 0,

    }
    const res = await makeApiCall('/api/v1/file-entries/delete', user?.access_token, 'post', data);
    setRefresh(!refresh);
    setModalVisible(!isVisible);
  }
  const downloadAndOpenFile = () => {
    try {
      let downloadUrl = AppSettings.base_url + '/api/v1/file-entries/download/' + item?.hash;
      console.log('downloadUrl', downloadUrl);
      const url = downloadUrl + '?add-preview-token=' + PreviewToken;
      const file_extension = item?.extension;
      const file_name = item?.name;
      let file_name_with_extension;
      if (file_extension !== null) {
        file_name_with_extension = file_name + '.' + file_extension;
      } else {
        file_name_with_extension = file_name + '.zip';
      }

      console.log(Platform.OS);
      if (Platform.OS === 'android') {
        ////console.log('sss');
        getDownloadPermissionAndroid().then(granted => {
          if (granted) {
            console.log('sss');
            downloadFile(url, file_name_with_extension);
          } else {
            downloadFile(url, file_name_with_extension);
            console.log('sssaa');
          }
        });
      } else {
        downloadFile(url, file_name_with_extension).then(res => {
          RNFetchBlob.ios.previewDocument(res.path());
        });
      }
    } catch (error) {
      console.log('error', error);
    }




  };
  return (
    <>


      <BottomSheet
        ref={bottomSheetRef}
        index={isVisible ? 0 : -1}
        snapPoints={['40%', '100%']}
        onChange={handleSheetChanges}
      >
        <BottomSheetView style={styles.contentContainer}>
          <>
            <TouchableOpacity style={styles.itemContainer} onPress={sharePopup}>
              <Image source={require('../assets/icons/fi_download.png')} style={styles.image}
              />
              <Text>Restore</Text>
            </TouchableOpacity>
                </>



        </BottomSheetView>
      </BottomSheet>
      <ShareFileModal
        isVisible={isShareModalVisible}
        onClose={toggleModal}
        user={user}
        file={item} // Replace with your actual file path
      />
      <RenameModal
        isVisible={isRenameModalVisible}
        onClose={toggleRenameModal}
        setRefresh={setRefresh}
        refresh={refresh}
        user={user}
        file={item} // Replace with your actual file path
      />
    </>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 15,
    paddingBottom: 10
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    paddingVertical: 7,
  },
  image: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
  },
});

export default ModalTrashedComponent;
