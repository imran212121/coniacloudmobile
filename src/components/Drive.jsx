import { StyleSheet, Text, View, Image, ActivityIndicator, TouchableOpacity,Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import DriveHeader from './DriveHeader';
import { isExists } from '../utils/DriveHelper';
import { useNavigation } from '@react-navigation/native';
import Preview from './preview/Preview';
import StorageStatus from './StorageStatus';
import AsyncStorage from '@react-native-async-storage/async-storage';
import folderIcon from '../assets/icon/folder.png';
import fileIcon from '../assets/icon/file.png';
import pdfIcon from '../assets/icons/pdf.png';
import wordIcon from '../assets/icon/word.png';
import imageIcon from '../assets/icon/image.png';
import back from '../assets/icons/fi_arrow-left.png';
import { baseURL } from '../constant/settings';
import {fileColorCode}  from '../constant/settings';

const Drive = ({ active, handleLoader, loading,refresh }) => {
  const [driveData, setDriveData] = useState([]);
  const [token, setToken] = useState(null);
  
  const [page, setPage] = useState(1);
  const [folderId, setFolderId] = useState(0);
  const [folder, setFolder] = useState([]);

  const [selected, setSelected] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [user, setUser] = useState(false);
  //const user = useSelector((state) => state.auth.user);
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
        if (data.folder && !isExists(data.folder.id, folder)) {
          setFolder((prev) => [...prev, { id: data.folder.id, name: data.folder.name }]);
        }
        console.log('Rerender',data.data);
        setDriveData(data.data);
      } catch (error) {
        handleLoader(false);
        console.error('Failed to fetch folder files:', error);
      }
    };

    fetchFolderFiles();
  }, [token, folderId, page,refresh]);



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
    <View style={{ marginTop: 2 ,width:deviceWidth-5}}>
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
          <View style={styles.headerBottom}>
            <DriveHeader folder={folder} selected={selected} handleFolderNavigation={handleFolderNavigation} />
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
                {driveData.map((files, index) => {
                  if (files.extension === "jpg" || files.extension === "jpeg" || files.extension === "svg") {
                    files.type = 'image';
                  }
                  return (
                    <TouchableOpacity key={index} style={[styles.filedata,{ width: deviceWidth * 0.4,backgroundColor:fileColorCode[Math.floor(Math.random() * 4)] }]} onPress={() => handleFile(files)}>
                      <Image source={fileType[files.type]} style={styles.fileIcon} />
                      <Text style={styles.fileText}>{files.name.length > 5 ? `${files.name.substring(0, 15)}...` : files.name}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <View style={[styles.paginationContainer, { width: deviceWidth * 0.9 }]}>
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
              </View>
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

export default Drive;

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
    
    margin: 14,
    height: 107,
    padding: 2,
    borderRadius: 20
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
    width:150,
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
    width: 30,
    height: 30,
    margin:5,
    alignItems:'flex-start'
  },
  fileText:{
    fontSize:14,
    fontWeight:'500',
    height:21,
    color:'#071625',
    marginTop:10,
    marginLeft:5

  }
});
