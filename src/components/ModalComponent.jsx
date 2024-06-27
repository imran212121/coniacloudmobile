import React, { useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity ,Button} from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

const items = [
  { id: 1, ImagePath: require('../assets/icon/fi_user-plus.png'), text: 'Share' },
  { id: 2, ImagePath: require('../assets/icons/fi_users.png'), text: 'Manage access' },
  { id: 3, ImagePath: require('../assets/icons/Vector.png'), text: 'Add to Starred' },
  { id: 4, ImagePath: require('../assets/icons/fi_wifi-off.png'), text: 'Make available offline' },
  { id: 5, ImagePath: require('../assets/icons/fi_download.png'), text: 'Download' },
  { id: 6, ImagePath: require('../assets/Modalicon/Link.png'), text: 'Copy link' },
  { id: 7, ImagePath: require('../assets/Modalicon/VectorArrow.png'), text: 'Send a copy' },
  { id: 8, ImagePath: require('../assets/Modalicon/fi_move.png'), text: 'Open in' },
  { id: 9, ImagePath: require('../assets/Modalicon/fi_edit-2.png'), text: 'Rename' },
  { id: 10, ImagePath: require('../assets/Modalicon/Logout.png'), text: 'Move' },
  { id: 11, ImagePath: require('../assets/Modalicon/u_copy-alt.png'), text: 'Make a copy' },
  { id: 12, ImagePath: require('../assets/Modalicon/Cloud.png'), text: 'Details and activity' },
  { id: 13, ImagePath: require('../assets/Modalicon/fi_printer.png'), text: 'Print' },
  { id: 14, ImagePath: require('../assets/Modalicon/u_cloud-exclamation.png'), text: 'Block' },
  { id: 15, ImagePath: require('../assets/Modalicon/pentagone.png'), text: 'Report' },
  { id: 16, ImagePath: require('../assets/Modalicon/fi_trash-2.png'), text: 'Remove' },
];

const ModalComponent = ({ isVisible, onClose }) => {
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

  return (
    <>

  
<BottomSheet
      ref={bottomSheetRef}
      index={isVisible ? 0 : -1}
      snapPoints={['40%', '100%']}
      onChange={handleSheetChanges}
    >
      <BottomSheetView style={styles.contentContainer}>
      <TouchableOpacity style={{alignSelf:'flex-end',right:10,top:20}}
     onPress={handleClosePress}>
      <Image source={require('../assets/icons/close.png')}
         style={{height:30,with:30, resizeMode: 'contain',}}/>
      </TouchableOpacity>
       {/* <Button title="Close Sheet" onPress={handleClosePress} /> */}
        {items.map((item) => (
          <TouchableOpacity style={styles.itemContainer} key={item.id}>
            <Image source={item.ImagePath} style={styles.image}
            />
            <Text>{item.text}</Text>
          </TouchableOpacity>
        ))}
      </BottomSheetView>
    </BottomSheet>

    </>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 15,
    paddingBottom:10
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

export default ModalComponent;
