import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, TouchableOpacity, Dimensions, TextInput, FlatList } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import folderIcon from '../assets/icon/folder.png';
import fileIcon from '../assets/icon/file.png';
import pdfIcon from '../assets/icons/pdf.png';
import wordIcon from '../assets/icon/word.png';
import imageIcon from '../assets/icon/image.png';
import noData from '../assets/no_data.png';
import back from '../assets/icons/fi_arrow-left.png';
import { baseURL, fileColorCode } from '../constant/settings';
import { AppSettings } from '../utils/Settings';
import StorageStatus from './StorageStatus';
import DriveHeader from './DriveHeader';
import Preview from './preview/Preview';
import { makeApiCall } from '../helper/apiHelper';
import RNFetchBlob from 'rn-fetch-blob';
import ShareFileModal from './model/Share';
import { timeAgo } from '../helper/functionHelper';
//import { downloadFile, getDownloadPermissionAndroid } from '../../helper/downloadHelper';
import { downloadFile,getDownloadPermissionAndroid } from '../helper/downloadHelper';

const Drive = ({ handleLoader, loading, refresh }) => {
  const [driveData, setDriveData] = useState([]);
  const [token, setToken] = useState(null);
  const [page, setPage] = useState(1);
  const [actionId, setActionId] = useState(null);
  const [files, setFile] = useState(null);
  const [actionDisplay, setActionDisplay] = useState(false);
  const [folderId, setFolderId] = useState(0);
  const [folder, setFolder] = useState([]);
  const [selected, setSelected] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [user, setUser] = useState(false);
  const [viewType, setViewType] = useState('grid');
  const [PreviewToken, setPreviewToken] = useState(false)
  const [isDownloadble, setIsDownloadble] = useState('block')
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  
  const deviceWidth = Dimensions.get('window').width;
  const [isModalVisible, setModalVisible] = useState(false);
  const [isDelete,setIsdelete] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  //let previewUrl = AppSettings.base_url + files.url;
  //let downloadUrl = AppSettings.base_url + '/api/v1/file-entries/download/' + files.hash;

  useEffect(() => {
    const checkLoginStatus = async () => {
      const users = JSON.parse(await AsyncStorage.getItem('user'));
      if (users && users.access_token) {
        setToken(users.access_token);
        setUser(users);
      }
    };
   
    checkLoginStatus();
   // fetchImageData();
  }, []);

  useEffect(() => {
    hidePopUp();
    const fetchFolderFiles = async () => {
      if (!token) return;
      console.log('Recent');
      handleLoader(true);
      try {
        const response = await axios.get(`${baseURL}/drive/file-entries?timestamp=${new Date().getTime()}`, {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            pageId: 0,
            folderId,
            page,
            workspaceId: 0,
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
        console.error('Failed to fetch folder files:', error);
      }
    };
    fetchFolderFiles();
  }, [token, folderId, page, refresh,isDelete]);

  const handleFile = (files) => {
    if (files.type === 'folder') {
      setFolderId(files.id);
      setSelected(false);
      setSelectedFile(null);
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
  const downloadAndOpenFile = () => {
    let downloadUrl = AppSettings.base_url + '/api/v1/file-entries/download/' + files?.hash;
    console.log('downloadUrl',downloadUrl);
    const url = downloadUrl + '?add-preview-token=' + PreviewToken;
    const file_extension = files?.extension;
    const file_name = files?.name;
    let  file_name_with_extension;
    if(file_extension!==null){
       file_name_with_extension = file_name + '.' + file_extension;
    }else{
      file_name_with_extension = file_name + '.zip' ;
    }
    
    console.log(Platform.OS);
    if (Platform.OS === 'android') {
        ////console.log('sss');
        getDownloadPermissionAndroid().then(granted => {
            if (granted) {
                console.log('sss');
                downloadFile(url, file_name_with_extension);
            } else {
                downloadFile(url, file_name_with_extension);
                console.log('sssaa');
            }
        });
    } else {
        downloadFile(url, file_name_with_extension).then(res => {
            RNFetchBlob.ios.previewDocument(res.path());
        });
    }



};
  const fetchImageData = async (file_id) => {
    try {
        const token = await makeApiCall('/api/v1/file-entries/' + file_id + '/add-preview-token', user?.access_token, 'post');
        console.log('token', token?.preview_token);
        setPreviewToken(token?.preview_token);
        //console.log(previewUrl + '?preview_token=' + PreviewToken);

    } catch (error) {
        console.log('error', error);
    }
}

  const actionPopup = (event, file) => {
    console.log('actionPopup',file);
    const { pageX, pageY } = event.nativeEvent;
    console.log('locationX, locationY', pageX, pageY);
    setPopupPosition({ x: pageX, y: pageY });
    setActionDisplay(true);
    setActionId(file.id);
    fetchImageData(file.id);
    setFile({id:file.id,hash:file.hash,name:file.name,extension:file.extension});
  };

  const hidePopUp = () => {setActionDisplay(false);}
  const handleViewToggle = () => {
    setViewType((prevViewType) => (prevViewType === 'grid' ? 'list' : 'grid'));
  };
  const renderGridItem = ({ item, index }) => {
    if (item.extension === 'jpg' || item.extension === 'jpeg' || item.extension === 'svg') {
      item.type = 'image';
    }
    return (
      <View
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
          <Image source={fileType[item.type]} style={styles.fileIcon} />
          <TouchableOpacity onPress={(event) => actionPopup(event, item)}>
            <Image source={require('../assets/MoreOption.png')} style={[styles.moreicon]} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => handleFile(item)}>
        <Text style={styles.fileText}>{item.name.length > 15 ? `${item.name.substring(0, 15)}...` : item.name}</Text>
        <Text style={styles.filetxtnormal}>{timeAgo(item.created_at)}</Text>
      </TouchableOpacity>
      </View>
    );
  };

  const renderListItem = ({ item, index }) => {
    if (item.extension === 'jpg' || item.extension === 'jpeg' || item.extension === 'svg') {
      item.type = 'image';
    }

    return (
      <View
        key={index}
        style={[
          styles.fileData,
          {
            backgroundColor: fileColorCode[Math.floor(Math.random() * 4)],
            height: 90,
            
            
          },
        ]}
       
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{flexDirection:'row',alignItems:'center',gap:15}}>
        <Image source={fileType[item.type]} style={[styles.fileIcon, { height: 40, width: 40 }]} />
       
        <TouchableOpacity onPress={() => handleFile(item)}>
        <View style={{ marginLeft: 10 }}>
          <Text style={[styles.fileText, { marginTop: 0 }]}>
            {item.name.length > 15 ? `${item.name.substring(0, 15)}...` : item.name}
          </Text>
          <Text style={styles.filetxtnormal}>{timeAgo(item.created_at)}</Text>
        </View>
        </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={(event) => actionPopup(event, item)}>
          <Image source={require('../assets/MoreOption.png')} style={[styles.moreicon, { height: 30, width: 20 }]} />
        </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={{ marginTop: 2, flex: 1 }} onPress={()=>{hidePopUp()}}>
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
          <View style={styles.inputContainer}>
            <TouchableOpacity>
              <Image source={require('../assets/Search.png')} style={styles.leftImage} />
            </TouchableOpacity>
            <TextInput style={styles.input} placeholder="Search" />
            <TouchableOpacity>
              <Image source={require('../assets/Filter.png')} style={styles.rightImage} />
            </TouchableOpacity>
          </View>
          {/* <View style={styles.headerBottom}>
            <DriveHeader folder={folder} selected={selected} handleFolderNavigation={handleFolderNavigation} />
          </View> */}
          {!selected ? (
            <>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 18 }}  >
                <Text style={styles.heading}>Recently edited</Text>
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <TouchableOpacity onPress={() => setViewType('list')}>
                    <Image source={require('../assets/list.png')} style={[styles.rightImage, { tintColor: viewType === 'list' ? '#004181' : '#B3B4B6' }]} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setViewType('grid')}>
                    <Image source={require('../assets/Grid.png')} style={[styles.rightImage, { tintColor: viewType === 'list' ? '#B3B4B6' : '#004181' }]} />
                  </TouchableOpacity>
                </View>
              </View>
              <FlatList
              key={viewType}
                data={driveData}
                renderItem={viewType === 'grid' ? renderGridItem : renderListItem}
                keyExtractor={(item, index) => index.toString()}
                numColumns={viewType === 'grid' ? 2 : 1}
              />
            </>
          ) : (
            <View style={styles.previewContainer}>
              <Preview selectedFile={selectedFile} handleFolderNavigation={handleFolderNavigation} closeFile={closeFile} user={user} />
            </View>
          )}
        </>
      )}
      {actionDisplay && (
        <View style={[
          styles.actionPopupContainer,
          {
            position: 'absolute',
            top: popupPosition.y - 20,
            left: popupPosition.x - 60
          }
        ]}>
          <TouchableOpacity style={styles.popupActionText} onPress={()=>{toggleModal()}}><Text>Share</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.popupActionText , {display:isDownloadble}]} onPress={()=>{downloadAndOpenFile()}}><Text>Download</Text></TouchableOpacity>
          <TouchableOpacity style={styles.popupActionText}
          onPress={async() => {
            let data = {
             entryIds:[files.id],
             deleteForever:0,
             
            }
            const res = await makeApiCall('/api/v1/file-entries/delete', user?.access_token, 'post',data);
            handleFolderNavigation(0);
            setIsdelete(!isDelete);
            hidePopUp();
            console.log('res',res)
     }}
          ><Text>Remove</Text></TouchableOpacity>
        </View>
      )}
      <ShareFileModal
        isVisible={isModalVisible}
        onClose={toggleModal}
        user={user}
        file={files} // Replace with your actual file path
      />
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
   color: '#696D70',
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
  actionPopupContainer: {
    width: 100,
    height: 120,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  popupActionText: {
    fontSize: 14,
    color: '#071625',
    lineHeight: 20,
    fontWeight: '500',
    padding: 10,
  }
});
