import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, TouchableWithoutFeedback } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { updateWorkspaceAsync } from '../redux/reducers/workspaceSlice';
import strings from '../helper/Language/LocalizedStrings';
import { useDispatch, useSelector } from 'react-redux';
import CreateFolderModal from './model/CreateFolder';

export default function Header({ modalHandler, setRefresh, handleLoader, loading, handleRefresh, refresh, uploadIcon, notiIcon, settingsIcon, onPress, parentId }) {
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [workspace, setWorkspace] = useState(null);
  const [isVisible, setIsvisible] = useState(false);
  const [isVisibleWorkspace, setIsvisibleWorkspace] = useState(false);
  const navigation = useNavigation();
  const Width = Dimensions.get('window').width;
  const [isModalVisible, setModalVisible] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const workspaces = useSelector((state) => state.workspace.workspace);
  useEffect(() => {
    console.log('*****Render****', workspaces);
   if(!user?.display_name)
    {
      navigation.navigate('Login');
    }
    setRefresh(!refresh);
  }, [workspaces,user])


  const dispatch = useDispatch();

  const toggleDisplay = () => {

    setIsvisibleWorkspace(false)

    setIsvisible(!isVisible);
    console.log(isVisible, isVisibleWorkspace);
  }

  const toggleDisplayWork = () => {

    setIsvisible(false);

    setIsvisibleWorkspace(!isVisibleWorkspace);
  }

  const toggleModal = () => {
    setModalVisible(!isModalVisible)
  };

  return (
    <>

      <View style={styles.headerContainer} >
        <View style={{ flexDirection: 'row' }}>
          <Image source={{ uri: user?.avatar }} style={styles.avatar} />
          <View style={styles.userInfo}>
            <Text style={styles.welcomeText}>{strings.WELCOME_BACK}</Text>
            <Text style={styles.userName}>{user?.display_name}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => toggleDisplayWork()}>
            <Image source={uploadIcon || require('../assets/arrangement.png')} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleDisplay()}>
            <Image source={uploadIcon || require('../assets/upload.png')} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onPress}>
            <Image source={notiIcon || require('../assets/noti.png')} style={styles.icon} />

          </TouchableOpacity>
          {!notiIcon ?
            <View style={{ height: 10, width: 10, backgroundColor: 'red', position: 'absolute', right: 0, bottom: 15, borderRadius: 10 }}>
            </View> : null}
          {/* Uncomment this if you want to include the settings button */}
          {/* <TouchableOpacity onPress={settingScreen}>
              <Image source={settingsIcon || require('../assets/settings.png')} style={styles.icon} />
            </TouchableOpacity> */}
        </View>
      </View>
      {isVisible &&

        <View style={[styles.modelContainer, { left: Width - 160 }]}>
          <View style={styles.modelList}>
            <TouchableOpacity style={styles.textList} onPress={() => { toggleModal() }}
            ><Text>{strings.CREATE_FOLDER}</Text></TouchableOpacity>
            <TouchableOpacity style={styles.textList} onPress={
              () => { navigation.navigate('UploadDoc'); }}><Text>{strings.UPLOAD_FILE}</Text></TouchableOpacity>
          </View>
        </View>

      }

      {isVisibleWorkspace &&
        <View style={[styles.modelContainer1, { left: Width - 160 }]}>
          <View style={styles.modelList}>
            <TouchableOpacity style={styles.textList} onPress={() => { dispatch(updateWorkspaceAsync(0)) }}
            >
              {workspaces === 0 ?
                <Text style={styles.select} key={0}>Private</Text>
                :
                <Text >Private</Text>
              }
            </TouchableOpacity>
            {user?.workspace?.map((item, index) => (
              <>
                {item.id === workspaces
                  ?
                  <TouchableOpacity key={index} style={styles.textListSelect} onPress={() => { dispatch(updateWorkspaceAsync(item.id));  }}
                  ><Text style={styles.select}>{item?.name}sss</Text>
                  </TouchableOpacity>
                  :
                  <TouchableOpacity key={index} style={styles.textList} onPress={() => { dispatch(updateWorkspaceAsync(item.id))}}
                  ><Text>{item?.name}</Text>
                  </TouchableOpacity>
                }

              </>
            ))}
          </View>
        </View>}
      <CreateFolderModal
        isVisible={isModalVisible}
        onClose={toggleModal}
        setRefresh={setRefresh}
        refresh={refresh}
        user={user}
        parentId={parentId}

      />
      {/* <WorkspaceModal
        isVisible={isModalVisible}
        onClose={toggleModal}
        setRefresh={setRefresh}
        refresh={refresh}
        user={user}
        parentId={parentId}
       
      /> */}
    </>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    height: 70,
    paddingHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // borderBottomColor: '#e6e6e6',
    // borderBottomWidth: 2,
    // backgroundColor: 'white',
  },
  select: {
    fontWeight: '700'
  },
  modelContainer: {
    width: 140,
    height: 80,
    top: 0,

    display: 'flex',
    flexDirection: 'column',
    borderRadius: 10,
    backgroundColor: '#fff'
  },
  modelContainer1: {
    width: 140,
    height: 'auto',
    minHeight: 100,
    top: 0,

    display: 'flex',
    flexDirection: 'column',
    borderRadius: 10,
    backgroundColor: '#fff'
  },
  textListSelect: {
    borderBottomColor: "#F0F0F0",
    borderBottomWidth: 1,
    color: '#000',
    fontWeight: '700',
    padding: 10
  },
  textList: {
    borderBottomColor: "#F0F0F0",
    borderBottomWidth: 1,
    color: '#000',
    padding: 10
  },
  modelList: {
    margin: 1
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginTop: 12,
    marginLeft: 8,
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 15,
  },
  welcomeText: {
    fontWeight: '400',
    fontSize: 13,
    color: '#696D70',
    height: 20,
  },
  userName: {
    fontWeight: '500',
    fontSize: 16,
    color: '#071625',
    height: 24,
  },
  icon: {
    width: 26,
    height: 26,
    marginLeft: 15,
  },
});
