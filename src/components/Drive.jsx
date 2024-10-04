

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
// Replace with your actual base URL
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const Drive = () => {
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
  const [currentFilter, setCurrentFilter] = useState(null);
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
      filterType: 'folder',
    },
    {
      id: 2,
      Image: fileIcon,
      title: 'File',
      filterType: 'file',
    },
    {
      id: 3,
      Image: imageIcon,
      title: 'Image',
      filterType: 'image',
    },
    {
      id: 4,
      Image: video,
      title: 'Video',
      filterType: 'video',
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
      const response = await axios.get(`${baseURL}/drive/file-entries`, {
        headers: {Authorization: `Bearer ${token}`},
        params: {
          pageId,
          folderId: folderId === 0 ? null : folderId,
          page,
          query: search,
          workspaceId: workspaces,
          deletedOnly: false,
          starredOnly: false,
          recentOnly: false,
          sharedOnly: false,
          per_page: 100,
          type: currentFilter,
        },
      });

      const {data} = response;
// console.log('Drive',response)
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
  }, [token, pageId, folderId, page, search, workspaces,currentFilter]);

  useEffect(() => {
    if (token) {
      fetchFolderFiles();
    }
  }, [fetchFolderFiles, token, refresh, currentFilter]);


  const handleFilterSelection = (filterType) => {
    if (currentFilter === filterType) {
      setCurrentFilter(null); // Deselect the filter if it's already selected
    } else {
      setCurrentFilter(filterType);
    }
    setPage(1); // Reset to the first page when changing filters
    fetchFolderFiles(); // Fetch files with the new filter
  };



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
    } else if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(item.extension)) {
      // Navigate to ImageViewer for image file types
      navigation.navigate('ImageViewer', {
        filePath: item,
        user: user,
      });
    } else if (['mp4', 'avi', 'mkv', 'mov', 'wmv'].includes(item.extension)) {
      navigation.navigate('VideoPreview', {
        filePath: item,
        user: user,
      });
    } else if (['mp3', 'wav', 'aac', 'flac'].includes(item.extension)) {
      navigation.navigate('AudioPreview', {
        filePath: item,
        user: user,
      });
    } else if (['doc', 'docx'].includes(item.extension)) {
      navigation.navigate('WordPreview', {
        filePath: item,
        user: user,
      });
    } else if (['txt'].includes(item.extension)) {
      navigation.navigate('TextFilePreview', {
        filePath: item,
        user: user,
      });
    } else {
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
          title={'My Drive'}
          ViewType={isGrid} // Pass the view type state
          hadleGidList={handleGridListToggle}
        />
        <View style={styles.StatusContainer}>
          <StorageStatus user={user} usertoken={token} />
        </View>

        <View style={styles.folderContainer}>
  {FilderData.map(item => (
    <View key={item.id} style={styles.folderItem}>
      <TouchableOpacity 
        style={[
          styles.filtercontainer,
          currentFilter === item.filterType && styles.selectedFilter
        ]}
        onPress={() => handleFilterSelection(item.filterType)}
      >
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
          {/* <View style={styles.header}>
            <TouchableOpacity onPress={handleBackPress} disabled={folderStack.length <= 1}>
              <Text style={[styles.backButton, folderStack.length - 1 <= 1 && styles.disabledText]}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.currentPath}>{currentFolder[folderStack.length - 1].name}</Text>
          </View> */}

          <View style={styles.header}>
            <TouchableOpacity
              onPress={handleBackPress}
              disabled={folderStack.length <= 1}>
              <Text
                style={[
                  styles.backButton,
                  folderStack.length <= 1 && styles.disabledText,
                ]}>
                ← Back
              </Text>
            </TouchableOpacity>
            <Text style={styles.currentPath}>
              {folderStack[folderStack.length - 1]?.name}
            </Text>
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

export default Drive;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
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
  selectedFilter: {
    backgroundColor: '#e0e0e0', // or any color to indicate selection
    borderWidth: 2,
    borderColor: '#004181',
  },
});
