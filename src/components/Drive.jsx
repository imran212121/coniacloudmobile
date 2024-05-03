import { StyleSheet, Text, View, Image, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import DriveHeader from './DriveHeader';
import { isExists } from '../utils/DriveHelper';
import { useNavigation } from '@react-navigation/native'
import Preview from './preview/Preview';
import StorageStatus from './StorageStatus'
// Import images at the top of your file
import folderIcon from '../assets/icons/folder.png';
import fileIcon from '../assets/icons/file.png';
import pdfIcon from '../assets/icons/pdf.png';
import wordIcon from '../assets/icons/word.png';
import imageIcon from '../assets/icons/image.png';

const Drive = ({ active,handleLoader,loading }) => {
  const [driveData, setDriveData] = useState(false)
  const [usertoken, setUserToken] = useState(false)
  const [disabled, setDisabled] = useState(false);
  const [selected, setSelected] = useState(false)
  const [selectedFile, setSelectedFile] = useState(false)
  const [pageId, setPageId] = useState(0);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPage, setNextPage] = useState(false);
  const [prevPage, setPrevPage] = useState(false);
  const [folderId, setFolderId] = useState(0);
  const [folder, setFolder] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const navigation = useNavigation();
  useEffect(() => {

    const fetchFolderFiles = async () => {
      handleLoader(true)
      const response = await axios.get(`https://drive.coniacloud.com/api/v1/drive/file-entries?timestamp=${new Date().getTime()}`, {
        headers: {
          Authorization: 'Bearer ' + user?.access_token
        },
        params: {
          pageId: pageId,
          folderId: folderId,
          page: page,
          workspaceId: 0,
          deletedOnly: false,
          starredOnly: false,
          recentOnly: false,
          sharedOnly: false,
          per_page: 100

        }
      });
      handleLoader(false);
      let isExist = isExists(response?.data?.folder?.id, folder);
      if (!isExist && response?.data?.folder) {
        folder.push({ 'id': response?.data?.folder?.id, 'name': response?.data?.folder?.name })
        setFolder(folder);
      }
      console.log('response?.data',response?.data);
      setDriveData(response?.data);
      setCurrentPage(response?.data?.current_page);
      setLastPage(response?.data?.last_page)
      if (response?.data?.next_page === null) { setNextPage(true) } else { setNextPage(false) }
      if (response?.data?.prev_page === null) { setPrevPage(true) } else { setPrevPage(false) }

    };
    //setTimeout(() => {
    if (user && user?.access_token != 'undefined') {
      console.log('user.access_token1', user?.access_token);
      setUserToken(user?.access_token);
      fetchFolderFiles();
    }

    // }, 200)


  }, [user?.access_token, usertoken, folderId, folder, selected, active, page])
  const size = 60;
  const fileType = {
    folder: folderIcon,
    file: fileIcon,
    pdf: pdfIcon,
    word: wordIcon,
    image: imageIcon
  };
  const handleNextMore = () => {
    setPage(page + 1);
  };
  const handlePrevMore = () => {
    setPage(page - 1);
  };
  const handleFile = (files) => {

    if (files?.type == 'folder') {
      setFolderId(files?.id);
      setSelected(false);
      setSelectedFile(false);
    } else {
      setSelected(true);
      setSelectedFile(files)
    }
  }

  const handleFolderNavigation = async (folderId) => {
    setSelected(false);
    setFolderId(folderId);
    let folderArray = [];
    let satisfy = false;
    folder.map((folders, key) => {

      if (folders.id === folderId) {
        //setFolder([]);
        satisfy = true;
        setFolder(folderArray);

      } else {
        if (!satisfy) {
          folderArray.push({ 'id': folders?.id, 'name': folders?.name })
        }
      }

    })
  }
  const closeFile = () => {
    setSelected(false);
  }

  return (
    <View style={{ marginTop: 2 }}>
      {loading ? (
         <View style={{ flex: 1,paddingVertical:150, justifyContent: 'center', alignItems: 'center' }}>
         <ActivityIndicator size="extra-large" color="#004181" animating={true} />
         {/* Other content */}
       </View>
        
      ):
      <>
      <View style={styles.StatusContainer}>
        <StorageStatus user={user} usertoken={usertoken} />
      </View>
      <View style={styles.headerBottom}>
        <DriveHeader lastPage={lastPage} currentPage={currentPage} folder={folder} selected={selected} handleFolderNavigation={handleFolderNavigation} />
      </View>
      {!selected ? (
        <>
          <View style={styles.driveContainer}>
            {driveData?.data?.length === 0 ?
              <>
                <View style={{ justifyContent: 'center', display: 'flex', flexDirection: 'column', marginLeft: 42, height: 300 }}>
                  <Image source={require('../assets/no_data.png')} style={{ width: 300, height: 220, borderRadius: 5 }} />
                  <Text style={{ fontSize: 18, justifyContent: 'center', fontWeight: 500, paddingLeft: 32, paddingTop: 20 }}>Upload files or folders here</Text>
                </View>

              </>
              :
              <></>
            }

            {driveData?.data?.map((files, index) => {
              console.log('files',files);
              if(files.extension=="jpg" || files.extension=="jpeg" || files.extension=="svg")
              {
                files.type='image';
              }
              return (
                <TouchableOpacity key={index} style={styles.filedata} onPress={() => { handleFile(files) }}>

                  {/* <MIcon color={'#ffde6c'} name={fileType[files.type]} size={size}></MIcon> */}
                  <Image
                    source={fileType[files.type]}
                    style={{ width: 70, height: 70 }}
                  />

                  <Text>{files?.name?.length > 5 ? files?.name.substring(0, 5) + '...' : files?.name}</Text>
                </TouchableOpacity>
              )

            })}

          </View>
          {(!prevPage || !nextPage) &&
            <View style={styles.paginationContainer}>
              <TouchableOpacity style={[styles.paginationButton, prevPage && styles.disabledButton]} onPress={handlePrevMore} disabled={prevPage}>
                <Text style={styles.paginationButtonText}>Prev</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.paginationButton, nextPage && styles.disabledButton]} onPress={handleNextMore} disabled={nextPage}>
                <Text style={styles.paginationButtonText}>Next</Text>
              </TouchableOpacity>
            </View>
          }

        </>
      ) : (
        <View style={styles.previewContainer}>
          <Preview selectedFile={selectedFile} handleFolderNavigation={handleFolderNavigation} folderId={folderId} closeFile={closeFile} user={user} />
        </View>
      )}
</>
      }


    </View>

  )
}

export default Drive

const styles = StyleSheet.create({
  driveContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  StatusContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewContainer: {
    width: 'auto',
    height: 'auto',
  },
  filedata: {
    backgroundColor: 'white',
    margin: 15,
    height: 100,
    alignItems: 'center',
    width: 100,
    padding: 10,
    borderRadius: 10
  },
  headerBottom: {
    height: 50,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBlockColor: '#e5e7eb'
  },
  loader: {
    marginTop: 10,
    alignItems: 'center',
  },
  paginationContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    alignItems: 'flex-start',
    marginBottom: 10
  },

  paginationButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    alignItems: 'center',
    width: 175,
    height: 40,
    marginLeft: 15
  },
  paginationButtonText: {
    color: '#fff',
    fontSize: 16,
    paddingTop: 9
  },
  disabledButton: {
    opacity: 0.5, // Example style for disabled button
  },
})