import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import CustomHeader from '../../components/CustomHeader';
import { AppColor } from '../../utils/AppColors';
import ProgressBar from '../../components/ProgressBar';
import CustomButton from '../../components/CustomButton';
import Switchcomponent from '../../components/Switchcomponent';
import ModalComponent from '../../components/ModalComponent';

const data = [
  {
    id: 1,
    ImgePath: require('../../assets/icons/Right.png'),
    text: 'Storage Management',
  },
  {
    id: 2,
    ImgePath: require('../../assets/icons/Right.png'),
    text: 'Stared files',
  },
  {
    id: 3,
    ImgePath: require('../../assets/icons/Right.png'),
    text: 'Notification',
  },
];

const UserProfile = () => {
  const [isModalVisible, setModalVisible] = useState(false);

  const handleModalOpen = () => {
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <CustomHeader back={true} left={true} right={true} />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 25 }}>
        <View style={styles.profileImageContainer}>
          <Image
            source={require('../../assets/Ellipse.png')}
            style={styles.profileImage}
          />
        </View>
        <View>
          <Text style={styles.Heading}>Rukaiya Muh’d</Text>
          <Text style={styles.normaltext}>1234 files - 32 folders</Text>
        </View>
      </View>
      <Text style={[styles.Heading, { lineHeight: 27, fontSize: 18, marginTop: 40 }]}>
        65.6 GB of 100 GB used
      </Text>
      <ProgressBar />
      <View style={{ marginTop: 30 }}>
        <CustomButton buttonTitle={'Upgrade Storage Space'} />
      </View>
      {data.map((item) => (
        <TouchableOpacity style={styles.Box} key={item.id}>
          <Text>{item.text}</Text>
          <Image
            source={item.ImgePath}
            style={{ height: 15, width: 15, resizeMode: "contain" }}
          />
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={styles.Box} onPress={handleModalOpen}>
        <Text>Use data for file transfer</Text>
        <Switchcomponent />
      </TouchableOpacity>
      <ModalComponent isVisible={isModalVisible} onClose={handleModalClose} />
    </View>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: AppColor.bgcolor,
  },
  profileImageContainer: {
    height: 60,
    width: 60,
    backgroundColor: 'red',
    borderRadius: 50,
  },
  profileImage: {
    height: '100%',
    width: '100%',
  },
  Heading: {
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 24,
    color: AppColor.noermalText,
  },
  normaltext: {
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 18,
    color: '#696D70',
  },
  Box: {
    flexDirection: 'row',
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: AppColor.white,
    height: 70,
    alignItems: 'center',
    borderRadius: 15,
    marginTop: 20,
  },
});
