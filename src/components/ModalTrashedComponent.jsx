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

  const restoreFile = async () => {
    let data = {
      entryIds: [item?.id],
     

    }
    const res = await makeApiCall('/api/v1/file-entries/restore', user?.access_token, 'post', data);
    setRefresh(!refresh);
    setModalVisible(!isVisible);
  }
 
  return (
    <>


      <BottomSheet
        ref={bottomSheetRef}
        index={isVisible ? 0 : -1}
        snapPoints={['20%', '100%']}
        onChange={handleSheetChanges}
      >
        <BottomSheetView style={styles.contentContainer}>
          <><TouchableOpacity style={{ alignSelf: 'flex-end', right: 10, top: 10 }}
            onPress={handleClosePress}>
            <Image source={require('../assets/icons/close.png')}
              style={{ height: 30, with: 30, resizeMode: 'contain', }} />
          </TouchableOpacity>
            <TouchableOpacity style={styles.itemContainer} onPress={restoreFile}>
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
