import { StyleSheet, ScrollView, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Drive from '../../components/Drive';  // Importing Drive component
import ModalView from '../../components/ModalView';
import { AppColor } from '../../utils/AppColors';
import { useNavigation } from '@react-navigation/native';

const Dashboard = () => {
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [folderId, setFolderId] = useState(null);  // To manage folder navigation
  const [folderPath, setFolderPath] = useState('');  // To track folder path
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

  const handleFolderPath = (path) => {
    setFolderPath(path);
    console.log('Received Folder Path in Header----->:', path);
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
        pathFolder={folderPath}
        onPress={() => navigation.navigate('Notification')} 
      />
      <ScrollView style={styles.mainContainer} showsVerticalScrollIndicator={false}>
        {/* Displaying the Drive component */}
        <Drive 
          folderId={folderId}  // Folder ID for navigation
          setFolderId={setFolderId}  // Function to change folder
          loading={loading} 
          refresh={refresh} 
          active={active} 
          handleLoader={handleLoader} 
          setRefresh={setRefresh} 
          handleFolderPath={handleFolderPath}  // To handle folder path changes
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
