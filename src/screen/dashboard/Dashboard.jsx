import { StyleSheet, ScrollView, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Drive from '../../components/Drive';
import ModalView from '../../components/ModalView';
import { AppColor } from '../../utils/AppColors';
import { useNavigation } from '@react-navigation/native';

const Dashboard = () => {
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [folderId, setFolderId] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    // Effect logic if needed
  }, [active, loading]);

  const modalHandler = (status, msg, isError = false) => {
    setActive(!active);
    setIsError(isError);
    setMessage(msg);
  };

  const handleLoader = (status) => {
    setLoading(status);
  };

  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  return (
    <>
      <Header 
        parentId={folderId} 
        handleRefresh={handleRefresh} 
        setRefresh={setRefresh} 
        refresh={refresh} 
        loading={loading} 
        handleLoader={handleLoader} 
        modalHandler={modalHandler} 
        active={active} 
        onPress={() => navigation.navigate('Notification')} 
      />
      <ScrollView style={styles.mainContainer} showsVerticalScrollIndicator={false}>
        {/* Uncomment this when needed */}
        {/* <ModalView modalHandler={modalHandler} active={active} isError={isError} message={message} /> */}
        <Drive 
          folderId={folderId} 
          setFolderId={setFolderId} 
          loading={loading} 
          refresh={refresh} 
          active={active} 
          handleLoader={handleLoader} 
          setRefresh={setRefresh} 
        />
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F1F1F1',
    // padding:10
  },
  normelText: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 19,
    color: AppColor.noermalText,
  },
  BoldlText: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    color: AppColor.boldText,
  },
  headerTextContainer: {
    position: 'absolute',
    top: 0,
    left: 50,
  },
});

export default Dashboard;
