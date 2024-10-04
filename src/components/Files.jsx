import { StyleSheet, Text, View,ScrollView,FlatList,Image,ActivityIndicator} from 'react-native'
import React , { useEffect, useState, useCallback } from 'react'
import axios from 'axios';
import { baseURL } from '../constant/settings';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { TouchableOpacity } from 'react-native-gesture-handler';
const Files = ({folder,refresh,folderId,page,pageId,search,token,handleLoader,setFolder,viewType,renderGridItem,renderListItem,EmplyFolder,loading}) => {
    const [driveData,setDriveData] = useState([]);
    const workspaces = useSelector((state) => state.workspace.workspace);
    const user = useSelector((state) => state.auth.user);
    useEffect(() => {
        
          const fetchFolderFiles = async () => {
            if (!user?.access_token) return;
            handleLoader(true);
            try {
              const response = await axios.get(`${baseURL}/drive/file-entries?timestamp=${new Date().getTime()}`, {
                headers: { Authorization: `Bearer ${user?.access_token}` },
                params: {
                  pageId: pageId,
                  folderId,
                  page,
                  query:search,
                  workspaceId: workspaces,
                  deletedOnly: false,
                  starredOnly: false,
                  recentOnly: false,
                  sharedOnly: false,
                  per_page: 100
                }
              });
              handleLoader(false);
              const { data } = response;
              // console.log('jamshed',data)
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
        }, [user, folderId, page, refresh,pageId,search])

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
    {loading ? (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#004181" />
      </View>
    ) : driveData && driveData.length > 0 ? (
      <>
  
      <FlatList
        key={viewType}
        data={driveData}
        renderItem={viewType === 'grid' ? renderGridItem : renderListItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={viewType === 'grid' ? 2 : 1}
      />
      
        </>  
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

const styles = StyleSheet.create({
  driveContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1
  },
 
  backContainer: {
    alignItems: 'flex-start',
  }, headerBottom: {
    height: 50,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBlockColor: '#e5e7eb'
  },
  previewContainer: {
    width: 'auto',
    height: 'auto',
  },
  fileData: {
    margin: 15,
    height: 115,
    padding: 12,
    borderRadius: 20,
    justifyContent: 'center'
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
    height: 21,
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
  input: {
    flex: 1,
    height: '100%',
  },
  rightImage: {
    width: 20,
    height: 20,
    marginLeft: 10,
  },
  filetxtnormal: {
    background: '#696D70',
    fontWeight: '400',
    fontSize: 12
  },
  moreicon: {
    height: 25,
    width: 10,
    resizeMode: 'contain'
  },
  heading: {
    fontSize: 18,
    color: '#071625',
    lineHeight: 27,
    fontWeight: '600'
  },
    btn: {
    position: 'absolute',
    right: 20,
    bottom: 40,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 36,
    lineHeight: 36,
  },
});