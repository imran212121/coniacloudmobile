import {TextInput, StyleSheet, Text, View, Image, ActivityIndicator, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import DriveHeader from './DriveHeader';
import { isExists } from '../utils/DriveHelper';
import { useNavigation } from '@react-navigation/native';
import Preview from './preview/Preview';
import StorageStatus from './StorageStatus';
import AsyncStorage from '@react-native-async-storage/async-storage';
import folderIcon from '../assets/icons/folder.png';
import fileIcon from '../assets/icons/file.png';
import pdfIcon from '../assets/icons/pdf.png';
import wordIcon from '../assets/icons/word.png';
import imageIcon from '../assets/icons/image.png';
import back from '../assets/icons/fi_arrow-left.png';
import { baseURL, fileColorCode } from '../constant/settings';
import { AppColor } from '../utils/AppColors';
import { timeAgo } from '../helper/functionHelper';
import strings from '../helper/Language/LocalizedStrings';
showItem = [{
  id: 1,
  Image: require('../assets/icon/image.png'),
  text: strings.Image
},
{
  id: 2,
  Image: require('../assets/icon/file.png'),
  text:strings.File
},
{
  id: 3,
  Image: require('../assets/icon/video.png'),
  text: strings.Video
},
{
  id: 4,
  Image: require('../assets/icon/folder.png'),
  text: strings.Folder
},
]



const Shared = ({ active, handleLoader, loading, refresh }) => {
  const [driveData, setDriveData] = useState([]);
  const [token, setToken] = useState(null);

  const [page, setPage] = useState(1);
  const [folderId, setFolderId] = useState(0);
  const [folder, setFolder] = useState([]);

  const [selected, setSelected] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [user, setUser] = useState(false);
  //const user = useSelector((state) => state.auth.user);
  const language = useSelector((state) => state.language.language);
  const deviceWidth = Dimensions.get('window').width;

  useEffect(() => {
    const checkLoginStatus = async () => {
      const users = JSON.parse(await AsyncStorage.getItem('user'));
      if (users && users.access_token) {
        setToken(users.access_token);
        setUser(users)
      }
    };
    checkLoginStatus();
  }, []);
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
              <Text style={[styles.fileText, { marginTop: 0, }]}>
                {item.name.length > 15 ? `${item.name.substring(0, 15)}...` : item.name}
              </Text>
              <Text style={styles.filetxtnormal}>{timeAgo(item.created_at)}</Text>
            </View>
          </View>

          <Image source={require('../assets/MoreOption.png')} style={[styles.moreicon, { height: 30, width: 20 }]} />
        </View>

      </TouchableOpacity>
    );
  };

  useEffect(() => {
    const fetchFolderFiles = async () => {
      if (!token) return;
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
            recentOnly: false,
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
  }, [token, folderId, page, refresh]);

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
    setFolder((prev) => prev.filter((f) => f.id !== folderId));
  };

  const closeFile = () => setSelected(false);

  const fileType = {
    folder: folderIcon,
    file: fileIcon,
    pdf: pdfIcon,
    word: wordIcon,
    image: imageIcon
  };

  return (
    <View style={{ marginTop: 2, width: deviceWidth - 5 }}>
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
          
          <View style={styles.inputContainer}>
            <TouchableOpacity>
              <Image source={require('../assets/Search.png')} style={styles.leftImage} />
            </TouchableOpacity>
            <TextInput style={styles.input} placeholder="Search" />
            <TouchableOpacity>
              <Image source={require('../assets/Filter.png')} style={styles.rightImage} />
            </TouchableOpacity>
          </View>
          <View style={styles.container}>
      {showItem.map((item) => (
        <TouchableOpacity key={item.id} style={styles.itemContainer}>
          <View style={{ backgroundColor: fileColorCode[Math.floor(Math.random() * 4)],padding:10,borderRadius:10}}>
          <Image source={item.Image} style={styles.image} />
          </View>
          <Text style={styles.noremalText}>{item.text}</Text>
        </TouchableOpacity>
      ))}
    </View>
          {!selected ? (
            <>
              <View style={styles.driveContainer}>
                {driveData.length === 0 && (
                  <View style={styles.noDataContainer}>
                    <Image source={require('../assets/no_data.png')} style={styles.noDataImage} />
                    <Text style={styles.noDataText}>Upload files or folders here</Text>
                  </View>
                )}
                {/* {driveData.map((files, index) => {
                  if (files.extension === "jpg" || files.extension === "jpeg" || files.extension === "svg") {
                    files.type = 'image';
                  }
                  return (
                    <TouchableOpacity key={index} style={styles.filedata} onPress={() => handleFile(files)}>
                      <Image source={fileType[files.type]} style={styles.fileIcon} />
                      <Text>{files.name.length > 5 ? `${files.name.substring(0, 5)}...` : files.name}</Text>
                    </TouchableOpacity>
                  );
                })} */}
                <FlatList

                  data={driveData}
                  renderItem={renderListItem}
                  keyExtractor={(item, index) => index.toString()}
                // numColumns={viewType === 'grid' ? 2 : 1}
                // contentContainerStyle={styles.driveContainer}
                />
              </View>
              {/* <View style={[styles.paginationContainer, { width: deviceWidth * 0.9 }]}>
                <TouchableOpacity
                  style={[styles.paginationButton, page <= 1 && styles.disabledButton && { width: deviceWidth * 0.4 }]}
                  onPress={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page <= 1}
                >
                  <Text style={styles.paginationButtonText}>Prev</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.paginationButton, page >= 5 && styles.disabledButton && { width: deviceWidth * 0.4 }]}
                  onPress={() => setPage((prev) => prev + 1)}
                  disabled={page >= 5}
                >
                  <Text style={styles.paginationButtonText}>Next</Text>
                </TouchableOpacity>
              </View> */}
            </>
          ) : (
            <View style={styles.previewContainer}>
              <Preview selectedFile={selectedFile} handleFolderNavigation={handleFolderNavigation} closeFile={closeFile} user={user} />
            </View>
          )}
        </>
      )}
    </View>
  );
};



const styles = StyleSheet.create({
  driveContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  StatusContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  backContainer: {
    alignItems: 'flex-start'
  },
  previewContainer: {
    width: 'auto',
    height: 'auto'
  },
  filedata: {
    backgroundColor: 'white',
    margin: 15,
    height: 80,
    alignItems: 'center',
    width: 80,
    padding: 10,
    borderRadius: 10
  },
  headerBottom: {
    height: 50,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderColor: '#e5e7eb'
  },
  loader: {
    marginTop: 10,
    alignItems: 'center'
  },
  paginationContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10
  },
  paginationButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    alignItems: 'center',
    width: 150,
    height: 40,
    marginHorizontal: 15
  },
  paginationButtonText: {
    color: '#fff',
    fontSize: 16,
    paddingVertical: 9
  },
  disabledButton: {
    opacity: 0.5
  },
  noDataContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 300,
    marginLeft: 42
  },
  noDataImage: {
    width: 300,
    height: 220,
    borderRadius: 5
  },
  noDataText: {
    fontSize: 18,
    fontWeight: '500',
    paddingLeft: 32,
    paddingTop: 20
  },
  fileIcon: {
    width: 70,
    height: 70
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
// alignItems:'center',
justifyContent:'center'

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
    // margin: 5,
    alignItems: 'flex-start',
  },
  fileText: {
    fontSize: 14,
    fontWeight: '500',
    height: 21,
    color: '#071625',
    marginTop: 20,
    // marginLeft: 5,
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
    marginTop: 20,
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
    // tintColor:'red'
    resizeMode: 'contain'
  },
  heading: {
    fontSize: 18,
    color: '#071625',
    lineHeight: 27,
    fontWeight: '600'
  },
  noremalText: {
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 21,
    color: AppColor.noermalText
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Adjust as needed: 'space-around', 'space-evenly', 'center'
    padding: 20,
  },
  itemContainer: {
    alignItems: 'center',
  },
  image: {
    height: 40,
    width: 40,
    resizeMode: 'contain',
  },
});


export default Shared
