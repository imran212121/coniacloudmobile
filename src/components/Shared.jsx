// import React, { useState, useEffect, useCallback } from 'react';
// import { useSelector } from 'react-redux';
// import { useNavigation } from '@react-navigation/native';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
// import  Ionicons  from 'react-native-vector-icons/Ionicons'; // Assuming you're using Expo
// import { baseURL } from '../constant/settings';

// // Replace with your actual base URL

// const Drive = () => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null);
//   const [page, setPage] = useState(1);
//   const [pageId, setPageId] = useState(0);
//   const [folderId, setFolderId] = useState(0);
//   const [fileEntries, setFileEntries] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [currentFolder, setCurrentFolder] = useState(null);
//   const [error, setError] = useState(null);
//   const [refresh, setRefresh] = useState(false);
//   const [search, setSearch] = useState("");
//   const [folderStack, setFolderStack] = useState([]);

//   const workspaces = useSelector((state) => state.workspace.workspace);
//   const navigation = useNavigation();

//   useEffect(() => {
//     const checkLoginStatus = async () => {
//       try {
//         const userData = await AsyncStorage.getItem('user');
//         if (userData) {
//           const parsedUserData = JSON.parse(userData);
//           setUser(parsedUserData);
//           setToken(parsedUserData.access_token);
//         } else {
//           navigation.navigate('Login');
//         }
//       } catch (error) {
//         console.error('Error checking login status:', error);
//         Alert.alert('Error', 'Failed to retrieve user data. Please log in again.');
//         navigation.navigate('Login');
//       }
//     };

//     checkLoginStatus();
//   }, [navigation]);

//   const fetchFolderFiles = useCallback(async () => {
//     if (!token) return;

//     setIsLoading(true);
//     try {
//       const response = await axios.get(`${baseURL}/drive/file-entries`, {
//         headers: { Authorization: `Bearer ${token}` },
//         params: {
//           pageId,
//           folderId: folderId === 0 ? null : folderId,
//           page,
//           query: search,
//           workspaceId: workspaces,
//           deletedOnly: false,
//           starredOnly: false,
//           recentOnly: false,
//           sharedOnly: false,
//           per_page: 100,
//         },
//       });

//       const { data } = response;

//       if (data?.folder) {
//         setCurrentFolder(data.folder);
//       } else {
//         setCurrentFolder(null);
//       }

//       setFileEntries(data.data || []);
//     } catch (error) {
//       console.error('Error fetching folder files:', error);
//       Alert.alert('Error', 'Failed to fetch files. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   }, [token, pageId, folderId, page, search, workspaces]);

//   useEffect(() => {
//     if (token) {
//       fetchFolderFiles();
//     }
//   }, [fetchFolderFiles, token, refresh]);

//   const updateDataAndFetchFiles = () => {
//     setRefresh(!refresh);
//   };

//   const handleItemPress = (item) => {
//     if (item.type === 'folder') {
//       setFolderStack(prevStack => [...prevStack, { id: folderId, name: currentFolder?.name || 'Root' }]);
//       setFolderId(item.id);
//       setPage(1);
//     } else {
//       // Handle file selection (e.g., open file, download, etc.)
//       console.log('File selected:', item.name);
//     }
//   };

//   const handleBackPress = () => {
//     if (folderStack.length > 0) {
//       const previousFolder = folderStack.pop();
//       setFolderStack([...folderStack]);
//       setFolderId(previousFolder.id);
//       setPage(1);
//     }
//   };

//   const renderItem = ({ item }) => (
//     <TouchableOpacity onPress={() => handleItemPress(item)}>
//       <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
//         <Ionicons
//           name={item.type === 'folder' ? 'folder' : 'document'}
//           size={24}
//           color={item.type === 'folder' ? 'orange' : 'blue'}
//         />
//         <Text style={{ marginLeft: 10 }}>{item.name}</Text>
//       </View>
//     </TouchableOpacity>
//   );

//   if (isLoading) {
//     return <Text>Loading...</Text>;
//   }

//   return (
//     <View style={{ flex: 1 }}>
//       {folderId !== 0 && (
//         <TouchableOpacity onPress={handleBackPress} style={{ padding: 10 }}>
//           <Text>← Back to {folderStack[folderStack.length - 1]?.name || 'Root'}</Text>
//         </TouchableOpacity>
//       )}
//       <Text style={{ padding: 10, fontWeight: 'bold' }}>
//         Current Folder: {currentFolder?.name || 'Root'}
//       </Text>
//       <FlatList
//         data={fileEntries}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.id.toString()}
//         onRefresh={updateDataAndFetchFiles}
//         refreshing={isLoading}
//       />
//     </View>
//   );
// };

// export default Drive;

// import { StyleSheet, Text, View, Image ,Dimensions, TouchableOpacity} from 'react-native';
// import React, { useEffect, useState } from 'react';
// import { AppColor } from '../utils/AppColors';
// import CustomHeader from './CustomHeader';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import StorageStatus from './StorageStatus';
// import { Alert } from 'react-native';
// import folderIcon from '../assets/icon/folder.png';
// import fileIcon from '../assets/icon/file.png';
// import pdfIcon from '../assets/icons/pdf.png';
// import play from '../assets/icons/pdf.png';
// import video from '../assets/icon/video.png';
// import wordIcon from '../assets/icon/word.png';
// import imageIcon from '../assets/icon/image.png';
// import axios from 'axios';
// import back from '../assets/icons/fi_arrow-left.png';
// import { useSelector } from 'react-redux';
// import { useNavigation } from '@react-navigation/native';
// import { baseURL } from '../constant/settings';
// const windowWidth = Dimensions.get('window').width;
// const windowHeight = Dimensions.get('window').height;
// // const workspaces = useSelector((state) => state.workspace.workspace);
// const Drive = () => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null);
//   const [page, setPage] = useState(1);
//   const [pageId, setPageId] = useState(0);
//   const [folderId, setFolderId] = useState(0);
//   const [fileEntries, setFileEntries] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [currentFolder, setCurrentFolder] = useState(null);
//   const [error, setError] = useState(null);
//   const [refresh, setRefresh] = useState(false);
//   const [search, setSearch] = useState("");

//   const workspaces = useSelector((state) => state.workspace.workspace); // Redux state
//   const navigation = useNavigation();

//   // Check login status and set user token
//   useEffect(() => {
//     const checkLoginStatus = async () => {
//       try {
//         const userData = await AsyncStorage.getItem('user');
//         if (userData) {
//           const parsedUserData = JSON.parse(userData);
//           setUser(parsedUserData);
//           setToken(parsedUserData.access_token);
//         } else {
//           navigation.navigate('Login'); // Redirect to login if no user data
//         }
//       } catch (error) {
//         console.error('Error checking login status:', error);
//         Alert.alert('Error', 'Failed to retrieve user data. Please log in again.');
//         navigation.navigate('Login'); // Redirect to login in case of error
//       }
//     };

//     checkLoginStatus();
//   }, [navigation]);

//   // Fetch folder files based on folderId, page, and token
//   const fetchFolderFiles = async () => {
//     if (!token) return;

//     setIsLoading(true);
//     try {
//       const response = await axios.get(`${baseURL}/drive/file-entries`, {
//         headers: { Authorization: `Bearer ${token}` },
//         params: {
//           pageId,
//           folderId: folderId === 0 ? null : folderId,
//           page,
//           query: search,
//           workspaceId: workspaces,
//           deletedOnly: false,
//           starredOnly: false,
//           recentOnly: false,
//           sharedOnly: false,
//           per_page: 100,
//         },
//       });

//       const { data } = response;

//       // Update folder and drive data
//       if (data?.folder) {
//         setCurrentFolder(data.folder);
//       } else {
//         setCurrentFolder(null);
//       }

//       setFileEntries(data.data || []);
//     } catch (error) {
//       console.error('Error fetching folder files:', error);
//       Alert.alert('Error', 'Failed to fetch files. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Trigger data fetch when relevant dependencies change
//   useEffect(() => {
//     if (token) {
//       fetchFolderFiles(); // Fetch files when token, page, or folderId change
//     }
//   }, [fetchFolderFiles, token, refresh]);

//   // Refresh the folder data when user requests
//   const updateDataAndFetchFiles = () => {
//     setRefresh(!refresh); // Trigger a refresh of data
//   };

//   if (isLoading) {
//     return <Text>Loading...</Text>; // Show loading state
//   }

//   const fileType = {
//     folder: folderIcon,
//     file: fileIcon,
//     pdf: pdfIcon,
//     word: wordIcon,
//     image: imageIcon,
//     jpg: imageIcon,
//     jpeg: imageIcon,
//     png: imageIcon,
//     gif: imageIcon,
//     svg: imageIcon,
//     audio: play,
//     video: video,
//   };

//   // FilderData array
//   const FilderData = [
//     {
//       id: 1,
//       Image: folderIcon,
//       title: 'Folder',
//     },
//     {
//       id: 2,
//       Image: fileIcon,
//       title: 'File',
//     },
//     {
//       id: 3,
//       Image: imageIcon,
//       title: 'Image',
//     },
//     {
//       id: 4,
//       Image: video,
//       title: 'Video',
//     },
//   ];

//   return (
//     <View style={styles.container}>
//       {/* Custom Header */}
//       <CustomHeader
//         left={true}
//         right={true}
//         title={'Drive'}
//         grid={true}
//         back={true}
//       />

//       {/* Storage Status */}
//       <View style={styles.StatusContainer}>
//         <StorageStatus user={user} usertoken={token} />
//       </View>

//       {/* Folder View using map */}
//       <View style={styles.folderContainer}>
//         {FilderData.map((item) => (
//           <View key={item.id} style={styles.folderItem}>
//             <TouchableOpacity style={styles.filtercontainer}>
//             <Image source={item.Image} style={styles.folderIcon} />
//               </TouchableOpacity>
//             <Text style={styles.folderTitle}>{item.title}</Text>
//           </View>
//         ))}
//       </View>
//     </View>
//   );
// };

// export default Drive;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: AppColor.bgcolor,
//     padding: windowWidth * 0.04,
//   },
//   StatusContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   folderContainer: {
//     flexDirection: 'row',
//     //  flexWrap: 'wrap', // Allows multiple rows if necessary
//     // justifyContent: 'space-between',
//     marginTop: windowHeight * 0.02,
//   },
//   folderItem: {
//     alignItems: 'center',
//     marginBottom: 20,
//     padding:15,
//     // backgroundColor:'red',
//     // // width: '45%',
//     // margin:10
//   },
//   folderIcon: {
//     height: windowHeight * 0.05, // Adjust folder icon size based on screen height
//     width: windowWidth * 0.12, // Adjust width for responsiveness
//     marginBottom: windowHeight * 0.01,
//     resizeMode:'contain'
//     // marginBottom: 10,
//     // backgroundColor:'red',
//     // width: '45%',

//   },
//   folderTitle: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#071625',
//   },
//   filtercontainer:{
//     padding:8,
//     backgroundColor:'#D7EFFF',
//     borderRadius:10
//   }
// });

import React, {useState, useEffect, useCallback} from 'react';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Assuming you're using Expo
import {baseURL} from '../constant/settings';
import RenderCardListGrid from '../components/RenderCardListGrid';
import CustomHeader from './CustomHeader';
import StorageStatus from './StorageStatus';
import folderIcon from '../assets/icon/folder.png';
import fileIcon from '../assets/icon/file.png';
import pdfIcon from '../assets/icons/pdf.png';
import play from '../assets/icons/pdf.png';
import video from '../assets/icon/video.png';
import wordIcon from '../assets/icon/word.png';
import imageIcon from '../assets/icon/image.png';
import Search from './Search';
// Replace with your actual base URL
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const Shared = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [page, setPage] = useState(1);
  const [pageId, setPageId] = useState(0);
  const [folderId, setFolderId] = useState(0);
  const [fileEntries, setFileEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [search, setSearch] = useState('');
  const [folderStack, setFolderStack] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [visibleShereModal, setVisible] = useState(false);
  const [isGrid, setIsGrid] = useState(true);

  const handleGridListToggle = () => {
    setIsGrid(!isGrid);
  };


  const workspaces = useSelector(state => state.workspace.workspace);

  const navigation = useNavigation();
  const fileType = {
    folder: folderIcon,
    file: fileIcon,
    pdf: pdfIcon,
    word: wordIcon,
    image: imageIcon,
    jpg: imageIcon,
    jpeg: imageIcon,
    png: imageIcon,
    gif: imageIcon,
    svg: imageIcon,
    audio: play,
    video: video,
  };
  // FilderData array
  const FilderData = [
    {
      id: 1,
      Image: folderIcon,
      title: 'Folder',
    },
    {
      id: 2,
      Image: fileIcon,
      title: 'File',
    },
    {
      id: 3,
      Image: imageIcon,
      title: 'Image',
    },
    {
      id: 4,
      Image: video,
      title: 'Video',
    },
  ];

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          setUser(parsedUserData);
          setToken(parsedUserData.access_token);
        } else {
          navigation.navigate('Login');
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        Alert.alert(
          'Error',
          'Failed to retrieve user data. Please log in again.',
        );
        navigation.navigate('Login');
      }
    };

    checkLoginStatus();
  }, [navigation]);

  const fetchFolderFiles = useCallback(async () => {
    if (!token) return;

    setIsLoading(true);
    try {
       const response = await axios.get(`${baseURL}/drive/file-entries?timestamp=${new Date().getTime()}${pageId}&folderId=${folderId}&workspaceId==${workspaces}&orderBy=updated_at&orderDir=desc&page=1&sharedOnly=true`, {
      // const response = await axios.get(`${baseURL}/drive/file-entries?timestamp=${new Date().getTime()}&&pageId=${pageId}&folderId=${folderId}&workspaceId==${workspaces}&orderBy=updated_at&orderDir=desc&page=1&sharedOnly=true`, {
        headers: { Authorization: `Bearer ${token}` },
        
      });
 console.log('shered---',response)
      const {data} = response;

      if (data?.folder) {
        setCurrentFolder(data.folder);
      } else {
        setCurrentFolder(null);
      }
     
      setFileEntries(data.data || []);
    } catch (error) {
      console.error('Error fetching folder files:', error);
      Alert.alert('Error', 'Failed to fetch files. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [token, pageId, folderId, page, search, workspaces]);

  useEffect(() => {
    if (token) {
      fetchFolderFiles();
    }
  }, [fetchFolderFiles, token, refresh]);

  const updateDataAndFetchFiles = () => {
    setRefresh(!refresh);
  };

  const toggleModalVisible = item => {
    setSelectedItem(item);
    setVisible(!visibleShereModal);
  };
  const handleItemPress = item => {
    if (item.type === 'folder') {
      setFolderStack(prevStack => [
        ...prevStack,
        {id: folderId, name: currentFolder?.name || 'Root'},
      ]);
      setFolderId(item.id);
      setPage(1);
    } else if (item.type === 'file') {
      // Handle general file logic
      Alert.alert('File Selected', `You selected: ${item.name}`);
    } else if (item.type === 'pdf') {
      // Navigate to PdfView screen
      navigation.navigate('PdfView', {
        filePath: item,
        user: user, 
      });
    }  else if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(item.extension)) {
      // Navigate to ImageViewer for image file types
      navigation.navigate('ImageViewer', {
        filePath: item,
        user: user, 
      });
    } 
    else if (['mp4', 'avi', 'mkv', 'mov', 'wmv'].includes(item.extension)){
      navigation.navigate('VideoPreview', {
        filePath: item,
        user: user, 
      });
    } else if (['mp3', 'wav', 'aac', 'flac'].includes(item.extension)){
      navigation.navigate('AudioPreview', {
        filePath: item,
        user: user, 
      });
    }
    else if (['doc', 'docx'].includes(item.extension)){
      navigation.navigate('WordPreview', {
        filePath: item,
        user: user, 
      });
    }
    else if (['txt'].includes(item.extension)){
      navigation.navigate('TextFilePreview', {
        filePath: item,
        user: user, 
      });
    }else {
      // Handle file selection (e.g., open file, download, etc.)
      console.log('File selected:', item.name);
    }
   
  };

  const handleBackPress = () => {
    if (folderStack.length > 0) {
      const previousFolder = folderStack.pop();
      setFolderStack([...folderStack]);
      setFolderId(previousFolder.id);
      setPage(1);
    }
  };

  return (
    <View style={{flex: 1, padding: 15}}>
      <View>
        <CustomHeader
          back={true}
          left={true}
          right={true}
          grid={true}
          title={'Shared'}
          ViewType={isGrid} 
        hadleGidList={handleGridListToggle}
        />
         <View style={styles.inputContainer}>
            <Search search={search} setsearch={setSearch} setpageId={setPageId} setpage={setPage}/>
          </View>

        <View style={styles.folderContainer}>
          {FilderData.map(item => (
            <View key={item.id} style={styles.folderItem}>
              <TouchableOpacity style={styles.filtercontainer}>
                <Image source={item.Image} style={styles.folderIcon} />
              </TouchableOpacity>
              <Text style={styles.folderTitle}>{item.title}</Text>
            </View>
          ))}
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#004181" />
        </View>
      ) : (
        <>
         

       

          <View style={styles.header}>
            <TouchableOpacity onPress={handleBackPress} disabled={folderStack.length <= 1}>
              <Text style={[styles.backButton, folderStack.length <= 1 && styles.disabledText]}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.currentPath}>{folderStack[folderStack.length - 1]?.name}</Text>
          </View>

          {/* <Text style={{  fontWeight: 'bold' }}>
        Current Folder: {currentFolder?.name || 'Root'}
      </Text> */}
          <RenderCardListGrid
            fileEntries={fileEntries}
            onPress={handleItemPress}
            refreshing={isLoading}
            onRefresh={updateDataAndFetchFiles}
            selectedItem={selectedItem}
            user={user}
            token={token}
            setRefresh={setRefresh}
            refresh={refresh}
            isLoading={isLoading}
            isGrid={isGrid}
          />
        </>
      )}
      {selectedItem && (
        <ModalComponent
          isVisible={visibleShereModal}
          setModalVisible={setVisible}
          onClose={toggleHideModal}
          user={user}
          PreviewToken={token}
          item={selectedItem}
          setRefresh={setRefresh}
          refresh={refresh}
          loading={isLoading}
        />
      )}
    </View>
  );
};

export default Shared;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  StatusContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  StatusContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  folderContainer: {
    flexDirection: 'row',
    //  flexWrap: 'wrap', // Allows multiple rows if necessary
    // justifyContent: 'space-between',
    marginTop: windowHeight * 0.02,
  },
  folderItem: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    // backgroundColor:'red',
    // // width: '45%',
    // margin:10
  },
  folderIcon: {
    height: windowHeight * 0.05, // Adjust folder icon size based on screen height
    width: windowWidth * 0.12, // Adjust width for responsiveness
    marginBottom: windowHeight * 0.01,
    resizeMode: 'contain',
    // marginBottom: 10,
    // backgroundColor:'red',
    // width: '45%',
  },
  folderTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#071625',
  },
  filtercontainer: {
    padding: 8,
    backgroundColor: '#D7EFFF',
    borderRadius: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backButton: {
    fontSize: 18,
    marginRight: 10,
  },
  disabledText: {
    color: '#ccc',
  },
  currentPath: {
    fontSize: 14,
    color: 'gray',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
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
});
