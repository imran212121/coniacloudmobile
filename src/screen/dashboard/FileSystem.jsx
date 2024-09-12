import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Alert, Image, TextInput, ActivityIndicator, PermissionsAndroid } from 'react-native';
import Modal from 'react-native-modal';
import DocumentPicker from 'react-native-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseURL } from '../../constant/settings';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

const FileSystem = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [folderModalVisible, setFolderModalVisible] = useState(false);
  const [driveData, setDriveData] = useState([]);
  const [folder, setFolder] = useState([{ id: 0, name: "All Files" }]);
  const [folderId, setFolderId] = useState(0);
  const [newFolderName, setNewFolderName] = useState('');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [workspaces, setWorkspaces] = useState(0);
  const [pageId, setPageId] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const toggleModal = () => setModalVisible(!modalVisible);
  const toggleFolderModal = () => setFolderModalVisible(!folderModalVisible);

  const handleLoader = (value) => setIsLoading(value);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userData = JSON.parse(await AsyncStorage.getItem('user'));
        setUser(userData);
      } catch (error) {
        console.error('Error checking login status:', error);
        Alert.alert('Error', 'Failed to retrieve user data. Please log in again.');
      }
    };
    checkLoginStatus();
  }, []);

  const requestStoragePermission = async () => {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
                title: 'File System App Storage Permission',
                message: 'File System App needs access to your storage to manage files and folders.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Storage permission granted');
        } else {
            console.log('Storage permission denied');
            Alert.alert('Permission Denied', 'Storage permission is required to manage files and folders.');
        }
    } catch (err) {
        console.warn(err);
    }
};

  useEffect(() => {
    requestStoragePermission();
  }, []);

// Handle errors more effectively and log response
const fetchFolderFiles = useCallback(async () => {
  if (!user?.access_token) return;
  
  handleLoader(true);
  try {
    const response = await axios.get(`${baseURL}/drive/file-entries`, {
      headers: { Authorization: `Bearer ${user?.access_token}` },
      params: {
        pageId: pageId,
        folderId,
        page,
        query: search,
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

    // Ensure folder structure is managed correctly
    if (data?.folder) {
      if (!folder.some(f => f.id === data.folder.id)) {
        setFolder((prev) => [...prev, { id: data.folder.id, name: data.folder.name }]);
      }
    } else {
      setFolder([{ id: 0, name: "All Files" }]);
    }

    setDriveData(data.data);
  } catch (error) {
    handleLoader(false);

    // Enhanced error handling
    if (error.response) {
      console.log('Server Error:', error.response.data);
      Alert.alert('Error', `Failed to fetch files: ${error.response.data.message || 'Unknown error'}`);
    } else if (error.request) {
      console.log('No response from server:', error.request);
      Alert.alert('Network Error', 'Unable to connect to the server.');
    } else {
      console.log('Request error:', error.message);
      Alert.alert('Error', `Unexpected error: ${error.message}`);
    }
  }
}, [user, folderId, page, pageId, search, workspaces]);


  useFocusEffect(
    useCallback(() => {
      fetchFolderFiles();
      return () => {
       
        console.log('FileSystem Screen is unfocused');
      };
    }, [fetchFolderFiles])
  );

  const createFolder = async () => {
    if (newFolderName.trim() === "") {
      Alert.alert('Error', 'Please enter a folder name');
      return;
    }
  
    try {
      const response = await axios.post(`${baseURL}/drive/folders`, { name: newFolderName, parent_id: folderId }, { headers: { Authorization: `Bearer ${user?.access_token}` } });

       
  
      if (response.data?.status === 'success') {
        const newFolder = response.data.folder;
        setDriveData((prevContents) => [...prevContents, newFolder]); // Add new folder to the current view
        toggleFolderModal(); // Close the folder modal
        setNewFolderName(''); // Reset the folder name input
        Alert.alert('Success', 'Folder created successfully!');
        fetchFolderFiles(); // Refresh folder contents
      } else {
        throw new Error('Folder creation failed');
      }
    } catch (error) {
      console.error('Error creating folder:', error);
      Alert.alert('Error', `Failed to create folder: ${error.message}`);
    }
  };
  

  const navigateToFolder = (item) => {
    if (item.type === 'folder') {
      setFolderId(item.id);
      setFolder(prev => [...prev, {id: item.id, hash: item.hash, name: item.name, extension: item.extension}]);
      fetchFolderFiles();
    } else if (item.type === 'file') {
      // Handle file navigation based on file type
      if (item.mime_type === 'application/pdf') {
        navigation.navigate('PdfView', { filePath: item.url });
      } else if (item.mime_type.startsWith('image/')) {
        navigation.navigate('ImageViewer', { filePath: item.url });
      } else {
        Alert.alert('File', `File name: ${item.name}\nType: ${item.mime_type}`);
      }
    }
  };

  const goBack = () => {
    if (folder.length > 1) {
      const newFolder = folder.slice(0, -1);
      setFolder(newFolder);
      setFolderId(newFolder[newFolder.length - 1].id);
      fetchFolderFiles();
    }
  };

  const uploadFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
  
      const fileUri = res[0].uri;
      const fileName = res[0].name;
      const fileType = res[0].type;
      
      const uploadUrl = `${baseURL}/drive/upload/${folderId}`;
      const token = user?.access_token;
  
      if (!token) {
        Alert.alert('Error', 'User token not available. Please log in again.');
        return;
      }
  
      // For Android, prepend "file://" if needed
      const formattedFileUri = Platform.OS === 'android' ? `file://${fileUri}` : fileUri;
  
      const formData = new FormData();
      formData.append('file', {
        uri: formattedFileUri,
        type: fileType, // This is important for the backend to identify the file type
        name: fileName,
      });
  
      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Do NOT set 'Content-Type' manually when sending FormData
        },
        body: formData,
      });
  
      const responseData = await response.json(); // Expect JSON response from server
  
      if (response.ok) {
        Alert.alert('Success', 'File uploaded successfully!');
        fetchFolderFiles(); // Refresh folder contents after upload
      } else {
        throw new Error(responseData.message || 'Upload failed');
      }
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log('User cancelled the picker');
      } else {
        console.error('Error uploading file:', error);
        Alert.alert('Error', `Failed to upload file: ${error.message}`);
      }
    }
  };
  
  

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigateToFolder(item)}>
      <View style={styles.item}>
        <Image 
          source={item.type === 'folder' ? require('../../assets/icon/Smallfolder.png') : require('../../assets/icon/file.png')} 
          style={styles.itemIcon} 
        />
        <Text>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} disabled={folder.length <= 1}>
          <Text style={[styles.backButton, folder.length <= 1 && styles.disabledText]}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.currentPath}>{folder[folder.length - 1].name}</Text>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={driveData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={<Text style={styles.emptyText}>This folder is empty</Text>}
        />
      )}

      <TouchableOpacity style={styles.btn} onPress={()=>navigation.navigate('UploadDoc')}>
        <Text style={styles.text}>+</Text>
      </TouchableOpacity>
      
      <Modal
        isVisible={modalVisible}
        onBackdropPress={toggleModal}
        style={styles.bottomModal}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.modalItem} onPress={() => { toggleModal(); toggleFolderModal(); }}>
            <Image source={require('../../assets/icon/Smallfolder.png')} style={styles.modalIcon} />
            <Text>Create Folder</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalItem} onPress={() => { toggleModal(); uploadFile(); }}>
            <Image source={require('../../assets/icon/spreadsheet.png')} style={styles.modalIcon} />
            <Text>Upload File</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        isVisible={folderModalVisible}
        onBackdropPress={toggleFolderModal}
        style={styles.centerModal}
      >
        <View style={styles.folderModalContainer}>
          <TextInput
            placeholder="Enter Folder Name"
            style={styles.input}
            value={newFolderName}
            onChangeText={setNewFolderName}
          />
          <TouchableOpacity style={styles.createButton} onPress={createFolder}>
            <Text style={styles.createButtonText}>Create Folder</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
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
  btn: {
    position: 'absolute',
    right: 20,
    bottom: 40,
    backgroundColor: '#000',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 30,
  },
  bottomModal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  centerModal: {
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  folderModalContainer: {
    backgroundColor: '#fff',
    width: '90%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  modalIcon: {
    width: 30,
    height: 30,
    marginRight: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingLeft: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  createButton: {
    width: '100%',
    height: 50,
    borderRadius: 5,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'gray',
  },
});

export default FileSystem;