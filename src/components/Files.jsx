import { StyleSheet, Text, View,ScrollView,FlatList,Image,ActivityIndicator} from 'react-native'
import React , { useEffect, useState, useCallback } from 'react'
import axios from 'axios';
import { baseURL } from '../constant/settings';
import { useFocusEffect } from '@react-navigation/native';
const Files = ({folder,refresh,folderId,page,pageId,search,token,handleLoader,setFolder,viewType,renderGridItem,renderListItem,EmplyFolder,loading}) => {
    const [driveData,setDriveData] = useState([]);
 
    useFocusEffect(useCallback(() => {
          // Refresh the screen or fetch data here
          // console.log('Home2222 Screen is focused',token,'imran');
          // console.log('search',search);
          // console.log('page',page);
          // console.log('pageId',pageId);
          const fetchFolderFiles = async () => {
            if (!token) return;
            // handleLoader(true);
            handleLoader(true);
            try {
              const response = await axios.get(`${baseURL}/drive/file-entries?timestamp=${new Date().getTime()}`, {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                  pageId: pageId,
                  folderId,
                  page,
                  query:search,
                  workspaceId: 0,
                  deletedOnly: false,
                  starredOnly: false,
                  recentOnly: false,
                  sharedOnly: false,
                  per_page: 100
                }
              });
              handleLoader(false);
              const { data } = response;
              console.log('data',data);
              if (data?.folder) {
                if (!folder.some(f => f.id === data.folder.id)) {
                  setFolder(prev => [...prev, { id: data.folder.id, name: data.folder.name }]);
                }
              } else {
                setFolder([{ "id": 0, "name": "All Files" }]);
              }
              setDriveData(data.data);
            } catch (error) {
              handleLoader(false);
              if (error.response) {
                // console.log('Server responded with status:', error.response.status);
                // console.log('Error message from server:', error.response.data);
              } else if (error.request) {
                console.log('No response received from server:', error.request);
              } else {
                console.log('Error setting up the request:', error.message);
              }
              if (error.status == 403 || error.status == 402) {
                navigation.navigate('Login');
              }
              console.error('Failed to fetch folder files:', error);
            }
          };
          fetchFolderFiles();
    
          return () => {
            // Cleanup if necessary when the screen is unfocused
            console.log('Home Screen is unfocused');
          };
        }, [token, folderId, page, refresh,pageId,search]))

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
    {loading ? (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#004181" />
      </View>
    ) : driveData && driveData.length > 0 ? (
      <FlatList
        key={viewType}
        data={driveData}
        renderItem={viewType === 'grid' ? renderGridItem : renderListItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={viewType === 'grid' ? 2 : 1}
      />
    ) : (
      <View style={styles.emptyContainer}>
        <Image source={EmplyFolder} style={styles.emptyImage} />
        <Text style={styles.emptyText}>Use upload button for file uploading</Text>
      </View>
    )}
  </ScrollView>
);
};

export default Files

const styles = StyleSheet.create({})