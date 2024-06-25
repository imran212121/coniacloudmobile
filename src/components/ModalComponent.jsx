import React, { useCallback, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

const item=[
  {
    id:1,
    ImagePath:require('../assets/icon/fi_user-plus.png'),
    text:'Share',
  },
  {
    id:2,
    ImagePath:require('../assets/icons/fi_users.png'),
    text:'Share',
  },
  {
    id:3,
    ImagePath:require('../assets/icons/Vector.png'),
    text:'Share',
  },
  {
    id:4,
    ImagePath:require('../assets/icons/fi_wifi-off.png'),
    text:'Share',
  },
  {
    id:5,
    ImagePath:require('../assets/icons/fi_download.png'),
    text:'Share',
  },
  {
    id:6,
    ImagePath:require('../assets/Modalicon/Link.png'),
    text:'Share',
  },
  {
    id:7,
    ImagePath:require('../assets/Modalicon/VectorArrow.png'),
    text:'Share',
  },
  {
    id:8,
    ImagePath:require('../assets/Modalicon/fi_move.png'),
    text:'Share',
  },
  {
    id:9,
    ImagePath:require('../assets/Modalicon/fi_edit-2.png'),
    text:'Share',
  },
  {
    id:10,
    ImagePath:require('../assets/Modalicon/Logout.png'),
    text:'Share',
  },
  {
    id:11,
    ImagePath:require('../assets/Modalicon/u_copy-alt.png'),
    text:'Share',
  },
  {
    id:12,
    ImagePath:require('../assets/Modalicon/Cloud.png'),
    text:'Share',
  },
  {
    id:13,
    ImagePath:require('../assets/Modalicon/fi_printer.png'),
    text:'Share',
  },
  {
    id:14,
    ImagePath:require('../assets/Modalicon/u_cloud-exclamation.png'),
    text:'Share',
  },
  {
    id:15,
    ImagePath:require('../assets/Modalicon/pentagone.png'),
    text:'Share',
  },
  {
    id:16,
    ImagePath:require('../assets/Modalicon/fi_trash-2.png'),
    text:'Share',
  },
  
]



const ModalComponent = ({ isVisible, onClose }) => {
  const bottomSheetRef = useRef(null);

  const handleSheetChanges = useCallback((index) => {
    console.log('handleSheetChanges', index);
    if (index === -1) {
      onClose();
    }
  }, [onClose]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={isVisible ? 0 : -1}
      snapPoints={['50%']}
      onChange={handleSheetChanges}
    >
      <BottomSheetView style={styles.contentContainer}>
        <Text>Awesome 🎉</Text>
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ModalComponent;
