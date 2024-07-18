import React, { useCallback, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

const ModalComponents = ({ isVisible, onClose }) => {
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

export default ModalComponents;
