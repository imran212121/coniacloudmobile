import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Alert, Image, TextInput, ActivityIndicator, Platform, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import DocumentPicker from 'react-native-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseURL, fileColorCode } from '../../constant/settings';
import axios from 'axios';
const deviceWidth = Dimensions.get('window').width;
import { useFocusEffect } from '@react-navigation/native';
import { AlertNotificationRoot, Dialog, ALERT_TYPE } from 'react-native-alert-notification';
import { makeApiCall } from '../../helper/apiHelper';
import RNFetchBlob from 'rn-fetch-blob';
import folderIcon from '../../assets/icon/folder.png';
import fileIcon from '../../assets/icon/file.png';
import pdfIcon from '../../assets/icons/pdf.png';
import play from '../../assets/icons/pdf.png';
import video from '../../assets/icon/video.png'
import wordIcon from '../../assets/icon/word.png';
import imageIcon from '../../assets/icon/image.png';
import back from '../../assets/icons/fi_arrow-left.png';
import { timeAgo } from '../../helper/functionHelper';
import Header from '../../components/Header';
import CustomHeader from '../../components/CustomHeader';
import StorageStatus from '../../components/StorageStatus';
import ModalComponent from '../../components/ModalComponent';
import CustomModal from '../../components/model/CustomModal ';
import { AppSettings } from '../../utils/Settings';
import Search from '../../components/Search';
const FileSystem = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [token, setToken] = useState(null);
  const [folderModalVisible, setFolderModalVisible] = useState(false);
  const [driveData, setDriveData] = useState([]);
  const [folder, setFolder] = useState([{ id: 0, name: "All Files" }]);
  const [folderId, setFolderId] = useState(0);
  const [newFolderName, setNewFolderName] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [workspaces, setWorkspaces] = useState(0);
  const [pageId, setPageId] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [folderPath, setFolderPath] = useState([]);
  const [parentId, setParentId] = useState(null);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [ViewType,setViewType]=useState('grid')
  const [selectedItem, setSelectedItem] = useState(null);
  const [visibleShereModal,setVisible]=useState(false)
  const toggleModal = () => setModalVisible(!modalVisible);
  const toggleFolderModal = () => setFolderModalVisible(!folderModalVisible);
  // let previewUrl = AppSettings.base_url + files.url;

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
          setToken(userData.access_token);
        } else {
          // Handle case where user data is not available
          // navigation.navigate('Login');
        }
      } catch (error) {
        console.error('Error checking login status:', error);
         Alert.alert('Error', 'Failed to retrieve user data. Please log in again.');
        navigation.navigate('Login');
      }
    };
    checkLoginStatus();
  }, [navigation]);

  const createFolder = async () => {
    if (newFolderName.trim() === "") {
      setError('Please enter a folder name');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const response = await makeApiCall('/api/v1/folders', user?.access_token, 'post', {
        parentId: folderId === 0 ? null : folderId,
        name: newFolderName,
      });
      console.log('Folder', response.folder.path)
      // setfolderpath(response.folder.path)
      setParentId(response.folder.parent_id)
      if (response?.status === 'success' && response.folder) {
        const newFolder = {
          id: response.folder.id,
          name: response.folder.name,
          type: 'folder',
          parent_id: response.folder.parent_id,
          hash: response.folder.hash,
        };

        setDriveData(prevData => [newFolder, ...prevData]);
        setNewFolderName('');
        setFolderModalVisible(false);
        setModalVisible(false);

        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Success',
          textBody: 'Folder successfully created!',
          button: 'close',
        });

        // No need to call fetchFolderFiles here as we've already updated the state
      } else {
        throw new Error('Folder creation failed');
      }
    } catch (error) {
      console.error('Error creating folder:', error);

      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: "There was an issue creating the folder.",
        button: 'close',
      });
    } finally {
      setIsLoading(false);
    }
  };


  
  const fetchFolderFiles = useCallback(async (search = '') => {
    if (!user?.access_token) return;
  
    setIsLoading(true);
  
    try {
      const response = await axios.get(`${baseURL}/drive/file-entries`, {
        headers: { Authorization: `Bearer ${user?.access_token}` },
        params: {
          pageId: search ? 'search' : pageId,
          folderId: search ? null : (folderId === 0 ? null : folderId),
          page,
          query: search,
          workspaceId: search ? 0 : workspaces,
          deletedOnly: false,
          starredOnly: false,
          recentOnly: false,
          sharedOnly: false,
          per_page: 100,
          orderBy: search ? 'updated_at' : undefined,
          orderDir: search ? 'desc' : undefined,
        },
      });
  
      const { data } = response;
  
      if (data?.folder) {
        setCurrentFolder(data.folder);
      } else {
        setCurrentFolder(null);
      }
  
      setDriveData(data.data || []);
    } catch (error) {
      console.error('Error fetching folder files:', error);
      Alert.alert('Error', 'Failed to fetch files. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [user, folderId, page, pageId, search, workspaces]);
  
  useEffect(() => {
    if (user?.access_token) {
      fetchFolderFiles();
      updateDataAndFetchFiles();
    }
  }, [fetchFolderFiles, user, refresh]);
  
  useFocusEffect(
    useCallback(() => {
      if (user?.access_token) {
        fetchFolderFiles();
      }
  
      return () => {
        setIsLoading(false);
      };
    }, [user, folderId, page, pageId, workspaces])
  );
  
  const handleSearch = (serach) => {
    if (search.trim() !== '') {
      fetchFolderFiles(search);
    } else {
      fetchFolderFiles(); // Fetch all files if search query is empty
    }
  };






  const updateDataAndFetchFiles = (newData) => {
    setDriveData(prevData => [newData, ...prevData]);
    setRefresh(false); // Triggers fetchFolderFiles in useEffect
  };
  


  const goBack = () => {
    if (folder.length > 1) {
      const newFolder = folder.slice(0, -1);
      setFolder(newFolder);
      setFolderId(newFolder[newFolder.length - 1].id);
      fetchFolderFiles();
    }
  };


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
    video: video
  };






 
  const toggleModalVisible = (item) => {
    setSelectedItem(item); 
    setVisible(!visibleShereModal);
  };
  const toggleHideModal=()=>{
    setVisible(!visibleShereModal);
  }

  const uploadFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      const fileUri = Platform.OS === 'ios' ? res[0].uri.replace('file://', '') : res[0].uri;
      const fileName = res[0].name;
      const uploadUrl = `${baseURL}/uploads`;
      const token = user?.access_token;

      setIsLoading(true);

      console.log('Uploading file:', fileName);
      console.log('Current folder:', currentFolder);

      let parentId = currentFolder ? currentFolder.id : null;
      let relativePath = currentFolder ? currentFolder.path : '';

      console.log('Parent ID:', parentId);
      console.log('Relative Path:', relativePath);

      const formData = [
        { name: 'file', filename: fileName, type: res[0].type, data: RNFetchBlob.wrap(fileUri) },
        { name: 'workspaceId', data: '0' },
        { name: 'parentId', data: parentId ? parentId.toString() : '' },
        { name: 'isSQL', data: 'false' },
        { name: 'relativePath', data: relativePath },
        { name: 'disk', data: 'uploads' },
      ];

      console.log('Form Data:', formData);

      const response = await RNFetchBlob.fetch('POST', uploadUrl, {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      }, formData);

      console.log('Response status:', response.respInfo.status);
      console.log('Response data:', response.data);

      if (response.respInfo.status === 200 || response.respInfo.status === 201) {
        const responseData = JSON.parse(response.data);
        if (responseData.status === 'success') {
          Dialog.show({
            type: ALERT_TYPE.SUCCESS,
            title: 'Success',
            textBody: 'File uploaded successfully!',
            button: 'close',
          });

          // Refresh the current folder contents
          setRefresh(true)
          fetchFolderFiles();
        } else {
          throw new Error(responseData.message || 'Upload failed');
        }
      } else {
        throw new Error(`Server responded with status ${response.respInfo.status}`);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('Document picking cancelled');
      } else {
        console.error('Error uploading file:', err);
        let errorMessage = 'Failed to upload file';
        if (err.message) {
          errorMessage += ': ' + err.message;
        }
        Alert.alert('Error', errorMessage);
      }
    } finally {
      setIsLoading(false);
      setModalVisible(false);
    }
  };


  const navigateToFolder = (item) => {
    if (item.type === 'folder') {
      setFolderId(item.id);
      setFolder(prev => [...prev, { id: item.id, name: item.name }]);
      fetchFolderFiles();
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
    }
    
    else {
      Alert.alert('Unknown Type', `Unsupported file type: ${item.type}`);
    }
  };
  








  const renderItemGrid = ({ item, index }) => {
    let fileTypeKey = 'file';
    if (item.type === 'folder') {
      fileTypeKey = 'folder';
    } else if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(item.extension)) {
      fileTypeKey = 'image';
    } else if (item.extension === 'pdf') {
      fileTypeKey = 'pdf';
    } else if (['doc', 'docx'].includes(item.extension)) {
      fileTypeKey = 'word';
    } else if (['xls', 'xlsx'].includes(item.extension)) {
      fileTypeKey = 'xls';
    } else if (['ppt', 'pptx'].includes(item.extension)) {
      fileTypeKey = 'ppt';
    } else if (['mp4', 'avi', 'mkv', 'mov', 'wmv'].includes(item.extension)) {
      fileTypeKey = 'video';
    } else if (['mp3', 'wav', 'aac', 'flac'].includes(item.extension)) {
      fileTypeKey = 'audio';
    } else if (item.extension === 'txt') {
      fileTypeKey = 'file';
    }
    return (
      <TouchableOpacity onPress={() => navigateToFolder(item)}
        style={[
          styles.fileData,
          {
            width: deviceWidth * 0.42,
            backgroundColor: '#CFECFF',
            flexDirection: 'column',
          },
        ]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {/* Display the correct icon based on file type */}
          <Image source={fileType[fileTypeKey]} style={styles.itemIcon} />

          {/* More options button */}
          <TouchableOpacity
            // onPress={() => handleModalOpen(item)}
            onPress={() => toggleModalVisible(item)}
          >
            <Image source={require('../../assets/MoreOption.png')} style={[styles.moreicon, { height: 20, width: 15 ,tintColor:fileColorCode[Math.floor(Math.random() * fileColorCode.length)]}]} />
          </TouchableOpacity>
        </View>
        <Text style={styles.fileText}>
          {item.name.length > 15 ? `${item.name.substring(0, 15)}...` : item.name}
        </Text>

        {/* Display the relative time when the file was created */}
        <Text style={styles.filetxtnormal}>{timeAgo(item.created_at)}</Text>
      </TouchableOpacity>
    )
  };
  const renderItemList = ({ item, index }) => {
    let fileTypeKey = 'file';
    if (item.type === 'folder') {
      fileTypeKey = 'folder';
    } else if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(item.extension)) {
      fileTypeKey = 'image';
    } else if (item.extension === 'pdf') {
      fileTypeKey = 'pdf';
    } else if (['doc', 'docx'].includes(item.extension)) {
      fileTypeKey = 'word';
    } else if (['xls', 'xlsx'].includes(item.extension)) {
      fileTypeKey = 'xls';
    } else if (['ppt', 'pptx'].includes(item.extension)) {
      fileTypeKey = 'ppt';
    } else if (['mp4', 'avi', 'mkv', 'mov', 'wmv'].includes(item.extension)) {
      fileTypeKey = 'video';
    } else if (['mp3', 'wav', 'aac', 'flac'].includes(item.extension)) {
      fileTypeKey = 'audio';
    } else if (item.extension === 'txt') {
      fileTypeKey = 'file';
    }
    return (
      <TouchableOpacity onPress={() => navigateToFolder(item)}
      style={[
        styles.fileData,
        {
          backgroundColor: '#CFECFF',
          height: 90,
        },
      ]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
          <Image source={fileType[fileTypeKey]} style={[styles.fileIcon, { height: 40, width: 40 }]} />
          <View>
            <Text style={[styles.fileText, { marginTop: 0 }]}>
              {item.name.length > 15 ? `${item.name.substring(0, 15)}...` : item.name}
            </Text>
            <Text style={styles.filetxtnormal}>{timeAgo(item.created_at)}</Text>
          </View>
        </View>
          {/* More options button */}
          <TouchableOpacity
           onPress={() => toggleModalVisible(item)}
          >
            <Image source={require('../../assets/MoreOption.png')} style={[styles.moreicon, { height: 30, width: 20,tintColor:fileColorCode[Math.floor(Math.random() * 4)] }]} />
          </TouchableOpacity>
        </View>
       

        {/* Display the relative time when the file was created */}
        {/* <Text style={styles.filetxtnormal}>{timeAgo(item.created_at)}</Text> */}
      </TouchableOpacity>
    )
  };
  return (
    <AlertNotificationRoot>
      <View style={{ flex: 1 }}>
        <Header
          parentId={currentFolder}
          // handleRefresh={handleRefresh} 
          setRefresh={setRefresh}
          refresh={refresh}
          loading={isLoading}
          // handleLoader={handleLoader} 
          // modalHandler={modalHandler} 
          // active={active} 
          userData={user}
          pathFolder={currentFolder}
        // onPress={() => navigation.navigate('Notification')} 
        />

        {/* <Image source={require('../../assets/ConiaSoft.png')} style={{height:120,width:130,alignSelf:'center',resizeMode:'contain'}}/> */}
        <View style={styles.StatusContainer}>
          <StorageStatus user={user} usertoken={token} />
        </View>
        <View style={styles.inputContainer}>
            <Search search={search} setsearch={setSearch} handleSearch={handleSearch} />
          </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 18 }}>
          <Text style={styles.heading}>Recently Edited</Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity
             onPress={() => setViewType('list')}
            >
              <Image source={require('../../assets/list.png')} style={[styles.rightImage, { tintColor: ViewType === 'list' ? '#004181' : '#B3B4B6' }]} />
            </TouchableOpacity>
            <TouchableOpacity
             onPress={() => setViewType('grid')}
            >
              <Image source={require('../../assets/Grid.png')} style={[styles.rightImage, { tintColor: ViewType === 'list' ?'#B3B4B6' :'#004181' }]} />
            </TouchableOpacity>
          </View>
        </View>

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
            key={ViewType}
              data={driveData}
              renderItem={ViewType==='grid'? renderItemGrid:renderItemList}
              keyExtractor={(item) => item.id.toString()}
              ListEmptyComponent={<Text style={styles.emptyText}>This folder is empty</Text>}
              refreshing={refresh}
              numColumns={ViewType==='grid'? 2: 1}
              onRefresh={() => {
                // setRefresh(true);
                fetchFolderFiles().then(() => setRefresh(false));
              }}
            />
          )}

          <TouchableOpacity style={styles.btn} onPress={toggleModal}>
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
    </AlertNotificationRoot>
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
    width: 30,
    height: 30,
    marginRight: 10,
  },
  btn: {
    position: 'absolute',
    right: 20,
    bottom: 40,
    backgroundColor: '#0071BC',
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
  driveContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1
  },
  StatusContainer: {
    alignItems: 'center',
    justifyContent: 'center',
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
    margin: 10,
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
    // height: 21,
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
 
  rightImage: {
    width: 20,
    height: 20,
    marginLeft: 10,
  },
  filetxtnormal: {
    // background: '#696D70',
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
  }
});

export default FileSystem;