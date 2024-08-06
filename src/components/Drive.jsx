import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, TouchableOpacity, Dimensions, TextInput, FlatList, ScrollView } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import folderIcon from '../assets/icon/folder.png';
import fileIcon from '../assets/icon/file.png';
import pdfIcon from '../assets/icons/pdf.png';
import wordIcon from '../assets/icon/word.png';
import imageIcon from '../assets/icon/image.png';
import back from '../assets/icons/fi_arrow-left.png';
import {fileColorCode } from '../constant/settings';
import StorageStatus from './StorageStatus';
import ShareFileModal from './model/Share';
import Preview from './preview/Preview';
import EmplyFolder from '../assets/notfound.png'

import DriveHeader from './DriveHeader'
import ModalComponent from './ModalComponent';
import { timeAgo } from '../helper/functionHelper';
import { setLanguage } from '../redux/reducers/languageSlice';
import strings from '../helper/Language/LocalizedStrings';
import { useSelector } from 'react-redux';
// import DriveHeader from './DriveHeader';
import Search from './Search';
import Files from './Files';
const Drive = ({ handleLoader, loading, refresh, setRefresh, folderId, setFolderId }) => {

  const [token, setToken] = useState(null);
  const [page, setPage] = useState(1);
  const [pageId, setPageId] = useState(0);
  const [search,setSearch] = useState('');
  const [folder, setFolder] = useState([]);
  const [selected, setSelected] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [user, setUser] = useState(false);
  const [viewType, setViewType] = useState('grid');
  const deviceWidth = Dimensions.get('window').width;
  const [PreviewToken, setPreviewToken] = useState(false)
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [files, setFile] = useState(null);
  const fetchImageData = async (file_id) => {
    try {
      const token = await makeApiCall('/api/v1/file-entries/' + file_id + '/add-preview-token', user?.access_token, 'post');
      setPreviewToken(token?.preview_token);
    } catch (error) {
      console.log('error', error);
    }
  }
  const language = useSelector((state) => state.language.language);
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

 
  const handleFile = (files) => {
    if (files.type === 'folder') {
      setFolderId(files.id);
      setSelected(false);
      setSelectedFile(null);
      setPage(1);
      setPageId(0);
      setRefresh(!refresh);
      setSearch(null)
    } else {
      setSelected(true);
      setSelectedFile(files);
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
            <Image source={fileType[item.type] || fileIcon} style={[styles.fileIcon, { height: 40, width: 40 }]} />
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
      {0 ? (
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
          <View style={styles.inputContainer}>
            <Search search={search} setsearch={setSearch} setpageId={setPageId} setpage={setPage}/>
          </View>
          <View style={[styles.headerBottom, { marginTop: 10 }]}>
            <DriveHeader folder={folder} selected={selected} handleFolderNavigation={handleFolderNavigation} />
          </View>
          {!selected ? (
            <>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 18 }}>
                <Text style={styles.heading}>{strings.HOME}</Text>
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <TouchableOpacity onPress={() => setViewType('list')}>
                    <Image source={require('../assets/list.png')} style={[styles.rightImage, { tintColor: viewType === 'list' ? '#004181' : '#B3B4B6' }]} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setViewType('grid')}>
                    <Image source={require('../assets/Grid.png')} style={[styles.rightImage, { tintColor: viewType === 'list' ? '#B3B4B6' : '#004181' }]} />
                  </TouchableOpacity>
                </View>
              </View>
              <Files 
                setFolder={setFolder} 
                folder={folder} 
                refresh={refresh} 
                page={page} 
                folderId={folderId} 
                pageId={pageId} 
                search={search} 
                token={token} 
                handleLoader={handleLoader}  
                viewType={viewType} 
                renderGridItem={renderGridItem} 
                renderListItem={renderListItem} 
                EmplyFolder={EmplyFolder}
                loading={loading}
              /> 
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

export default Drive;

const styles = StyleSheet.create({
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
