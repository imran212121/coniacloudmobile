import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Ensure this import is present
import { baseURL } from './src/constant/settings';
import CustomModal from './src/components/model/CustomModal ';

const Test1 = ({ route }) => {
  const { pageId, folderId, page, search } = route.params;
  const [fetchedDocuments, setFetchedDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const openModal = (document) => {
    setSelectedDocument(document);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedDocument(null);
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const users = JSON.parse(await AsyncStorage.getItem('user'));
        if (users && users.access_token) {
          setToken(users.access_token);
        } else {
          console.log('No token found');
        }
      } catch (error) {
        console.error('Error retrieving token:', error);
      }
    };
    checkLoginStatus();
  }, []);

  useEffect(() => {
    if (token) {
      const fetchDocuments = async () => {
        try {
          const response = await axios.get(`${baseURL}/drive/file-entries`, {
            headers: { Authorization: `Bearer ${token}` },
            params: {
              pageId,
              folderId,
              page,
              query: search,
              workspaceId: 0,
              deletedOnly: false,
              starredOnly: false,
              recentOnly: false,
              sharedOnly: false,
              per_page: 100
            }
          });

          // Log the full API response to understand its structure
          // console.log('Full API Response:', response.data);

          const data = Array.isArray(response.data) ? response.data : response.data.data;

          if (data && Array.isArray(data)) {
            const jpgDocuments = data.filter(doc => 
              doc.type === 'file',
              
            );

            // console.log('Filtered .jpg documents:', jpgDocuments);

            setFetchedDocuments(jpgDocuments);
          } else {
            console.error('Data is not an array:', data);
            setError(new Error('Unexpected data format'));
          }
        } catch (error) {
          console.error('Error fetching documents:', error);
          setError(error);
        } finally {
          setLoading(false);
        }
      };

      fetchDocuments();
    }
  }, [token, pageId, folderId, page, search]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4F8EF7" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Error fetching documents: {error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={fetchedDocuments}
        renderItem={({ item }) => (
          <View style={styles.item}>
        
            <Image
               source={require('./src/assets/150.jpg')} // Adjust URL if necessary
               style={styles.image}
             />
          
            <Text style={styles.title}>
            {item.name.length > 20 ? `${item.name.substring(0, 20)}...` : item.name}
              </Text>
              <TouchableOpacity  onPress={() => openModal(item)}>

              <Image
               source={require('./src/assets/MoreOption.png')} // Adjust URL if necessary
               style={[{alignSelf:'flex-end',height:25,width:25,alignSelf:'center'}]}
             />
              </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
      />
       {selectedDocument && (
        <CustomModal
          visible={isModalVisible}
          onClose={closeModal}
          document={selectedDocument}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  item: {
    // marginBottom: 20,
    // borderRadius:20,
    // alignItems:'center',
  flex:1,
     justifyContent:'space-between',
    height:100,
    width:'100%',
    // borderWidth:1, 
    flexDirection: 'row', 
    alignItems: 'center',
    // justifyContent: 'flex-start',
    marginBottom: 20,
    borderRadius: 20,
    // padding: 10, 
    backgroundColor: '#f9f9f9', 
    // borderWidth: 1,
    // borderColor: '#ddd',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'stretch',
    marginRight: 10, 
    borderRadius:20
  },
  error: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Test1;
