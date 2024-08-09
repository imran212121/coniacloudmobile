import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, TouchableOpacity, Dimensions, TextInput, FlatList, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import folderIcon from '../assets/icon/folder.png';
import fileIcon from '../assets/icon/file.png';
import pdfIcon from '../assets/icons/pdf.png';
import wordIcon from '../assets/icon/word.png';
import imageIcon from '../assets/icon/image.png';
import back from '../assets/icons/fi_arrow-left.png';
import { baseURL, fileColorCode } from '../constant/settings';
import StorageStatus from './StorageStatus';
import Preview from './preview/Preview';
import DriveHeader from './DriveHeader';
import ModalComponent from './ModalComponent';
import { timeAgo } from '../helper/functionHelper';
import { useSelector } from 'react-redux';
import strings from '../helper/Language/LocalizedStrings';

const MyDrive = ({ handleLoader, loading, refresh, setRefresh }) => {
  const [driveData, setDriveData] = useState([]);
  const [token, setToken] = useState(null);
  const [page, setPage] = useState(1);
  const [pageId, setPageId] = useState(0);
  const [folderId, setFolderId] = useState(0);
  const [folder, setFolder] = useState([]);
  const [selected, setSelected] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [user, setUser] = useState(false);
  const [viewType, setViewType] = useState('grid');
  const deviceWidth = Dimensions.get('window').width;
  const [PreviewToken, setPreviewToken] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const language = useSelector((state) => state.language.language);
  const [files, setFile] = useState(null);
  const [search, setSearch] = useState('');
  const workspaces = useSelector((state) => state.workspace.workspace);
  const fetchImageData = async (file_id) => {
    try {
      const token = await makeApiCall('/api/v1/file-entries/' + file_id + '/add-preview-token', user?.access_token, 'post');
     
      setPreviewToken(token?.preview_token);
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleModalOpen = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
    setFile({ id: item.id, hash: item.hash, name: item.name, extension: item.extension });
    fetchImageData(item.id);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      const users = JSON.parse(await AsyncStorage.getItem('user'));
      if (users && users.access_token) {
        setToken(users.access_token);
        setUser(users);
      }
    };
    checkLoginStatus();
  }, []);

  useFocusEffect(
    useCallback(() => {
      console.log('MyDrive Screen is focused');
      const fetchFolderFiles = async () => {
        console.log('token',token);
        if (!token) return;
        handleLoader(true);
        try {
          const response = await axios.get(`${baseURL}/drive/file-entries?timestamp=${new Date().getTime()}`, {
            headers: { Authorization: `Bearer ${token}` },
            params: {
              pageId,
              folderId,
              page,
              query: search,
              workspaceId: workspaces,
              deletedOnly: false,
              starredOnly: false,
              recentOnly: true,
              sharedOnly: false,
              per_page: 100
            }
          });
          handleLoader(false);
          const { data } = response;
          if (data.folder && !folder.some(f => f.id === data.folder.id)) {
            setFolder(prev => [...prev, { id: data.folder.id, name: data.folder.name }]);
          }
          setDriveData(data.data);
        } catch (error) {
          handleLoader(false);
          if (error.response) {
            console.log('Server responded with status:', error.response.status);
            if(error.response.status==403)
              {
                navigation.navigate('Login');
              }
            console.log('Error message from server:', error.response.data);
          } else if (error.request) {
            console.log('No response received from server:', error.request);
          } else {
            console.log('Error setting up the request:', error.message);
          }
          console.error('Failed to fetch folder files:', error);
        }
      };
      fetchFolderFiles();

      return () => {
        console.log('MyDrive Screen is unfocused');
      };
    }, [token, folderId, page, refresh, search])
  );

  const handleFile = (files) => {
    if (files.type === 'folder') {
      setFolderId(files.id);
      setSelected(false);
      setSelectedFile(null);
      setPage(1);
      setPageId(0);
      setRefresh(!refresh);
      setSearch('');
    } else {
      setSelected(true);
      setSelectedFile(files);
      setSearch('');
    }
  };

  const handleFolderNavigation = (folderId) => {
    setSelected(false);
    setFolderId(folderId);
    let folderArray = [];
    for (let x in folder) {
      if (folder[x].id == folderId) {
        folderArray.push(folder[x]);
        break;
      } else {
        folderArray.push(folder[x]);
      }
    }
    setFolder(folderArray);
  };

  const closeFile = () => setSelected(false);

  const fileType = {
    folder: folderIcon,
    file: fileIcon,
    pdf: pdfIcon,
    word: wordIcon,
    image: imageIcon
  };

  const renderGridItem = ({ item, index }) => {
    if (item.extension === 'jpg' || item.extension === 'jpeg' || item.extension === 'svg') {
      item.type = 'image';
    }
    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.fileData,
          {
            width: deviceWidth * 0.42,
            backgroundColor: fileColorCode[Math.floor(Math.random() * 4)],
            flexDirection: 'column',
          },
        ]}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity onPress={() => handleFile(item)}>
            <Image source={fileType[item.type]} style={styles.fileIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleModalOpen(item)}>
            <Image source={require('../assets/MoreOption.png')} style={[styles.moreicon]} />
          </TouchableOpacity>
        </View>
        <Text style={styles.fileText}>{item.name.length > 15 ? `${item.name.substring(0, 15)}...` : item.name}</Text>
        <Text style={styles.filetxtnormal}>{timeAgo(item.created_at)}</Text>
      </TouchableOpacity>
    );
  };

  const renderListItem = ({ item, index }) => {
    if (item.extension === 'jpg' || item.extension === 'jpeg' || item.extension === 'svg') {
      item.type = 'image';
    }
    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.fileData,
          {
            backgroundColor: fileColorCode[Math.floor(Math.random() * 4)],
            height: 90
          },
        ]}
        onPress={() => handleFile(item)}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
            <Image source={fileType[item.type]} style={[styles.fileIcon, { height: 40, width: 40 }]} />
            <View>
              <Text style={[styles.fileText, { marginTop: 0 }]}>
                {item.name.length > 15 ? `${item.name.substring(0, 15)}...` : item.name}
              </Text>
              <Text style={styles.filetxtnormal}>{timeAgo(item.created_at)}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => handleModalOpen(item)}>
            <Image source={require('../assets/MoreOption.png')} style={[styles.moreicon, { height: 30, width: 20 }]} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };


  return (
    <View style={{ marginTop: 2, flex: 1 }}>
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#004181" />
        </View>
      ) : (
        <>
          {selected && (
            <View style={styles.backContainer}>
              <TouchableOpacity style={{ marginLeft: 5, marginTop: 5 }} onPress={() => handleFolderNavigation(folderId)}>
                <Image source={back} style={{ width: 25, height: 15 }} />
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.StatusContainer}>
            <StorageStatus user={user} usertoken={token} />
          </View>
          {/* <View style={styles.inputContainer}>
            <TouchableOpacity>
              <Image source={require('../assets/Search.png')} style={styles.leftImage} />
            </TouchableOpacity>
            <TextInput style={styles.input} placeholder="Search" />
            <TouchableOpacity>
              <Image source={require('../assets/Filter.png')} style={styles.rightImage} />
            </TouchableOpacity>
          </View> */}
          <View style={[styles.headerBottom,{marginTop:10}]}>
            <DriveHeader folder={folder} selected={selected} handleFolderNavigation={handleFolderNavigation} />
          </View>
          {!selected ? (
            <>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 18 }}>
                <Text style={styles.heading}>{strings.RECENTLY_EDITED}</Text>
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <TouchableOpacity onPress={() => setViewType('list')}>
                    <Image source={require('../assets/list.png')} style={[styles.rightImage, { tintColor: viewType === 'list' ? '#004181' : '#B3B4B6' }]} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setViewType('grid')}>
                    <Image source={require('../assets/Grid.png')} style={[styles.rightImage, { tintColor: viewType === 'list' ? '#B3B4B6' : '#004181' }]} />
                  </TouchableOpacity>
                </View>
              </View>
              <ScrollView showsVerticalScrollIndicator={false}>
                <FlatList
                  key={viewType}
                  data={driveData}
                  renderItem={viewType === 'grid' ? renderGridItem : renderListItem}
                  keyExtractor={(item, index) => index.toString()}
                  numColumns={viewType === 'grid' ? 2 : 1}
                />
              </ScrollView>
            </>
          ) : (
            <View style={styles.previewContainer}>
              <Preview selectedFile={selectedFile} handleFolderNavigation={handleFolderNavigation} closeFile={closeFile} user={user} />
            </View>
          )}
          <ModalComponent setModalVisible={setModalVisible} refresh={refresh} setRefresh={setRefresh} isVisible={isModalVisible} onClose={handleModalClose} item={files} user={user} PreviewToken={PreviewToken} />

        </>
      )}
    </View>
  );
};

export default MyDrive;

const styles = StyleSheet.create({
  driveContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1
  },headerBottom: {
    height: 50,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBlockColor: '#e5e7eb'
  },
  StatusContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  backContainer: {
    alignItems: 'flex-start',
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
  }
});
