import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DocumentPicker from 'react-native-document-picker';

// Data categories
const DATA = [
  { id: '1', title: 'Total files', icon: 'folder-outline', screen: 'Folder' },
  { id: '2', title: 'Videos', icon: 'videocam-outline', screen: 'Videos' },
  { id: '3', title: 'Images', icon: 'image-outline', screen: 'Images' },
  { id: '4', title: 'Documents', icon: 'document-text-outline', screen: 'Documents' },
  { id: '5', title: 'Archive', icon: 'archive-outline', screen: 'Archive' },
  { id: '6', title: 'Zip files', icon: 'archive-outline', screen: 'Zip files' },
  { id: '7', title: 'Music', icon: 'musical-notes-outline', screen: 'Music' },
  { id: '8', title: 'APK files', icon: 'logo-android', screen: 'APK files' },
  { id: '9', title: 'Large files', icon: 'file-tray-full-outline', screen: 'Folder' },
];

// Categorize document based on type
const categorizeDocument = (docs) => {
  return docs.map(doc => {
    const type = (doc.type || '').toLowerCase();
    let category;
    if (type.startsWith('image/')) {
      category = 'Images';
    } else if (type.startsWith('video/')) {
      category = 'Videos';
    } else if (type === 'application/pdf' || type.startsWith('application/msword')) {
      category = 'Documents';
    } else if (type === 'application/zip' || type.startsWith('application/x-zip')) {
      category = 'Zip files';
    } else if (type.includes('audio/')) {
      category = 'Music';
    } else {
      console.warn('Unknown document type:', type);
      category = 'Total files'; // Default category
    }
    return { ...doc, category };
  });
};

const Item = ({ title, icon, onPress }) => (
  <TouchableOpacity style={styles.item} onPress={() => onPress(title)}>
    <Icon name={icon} size={30} color="#4F8EF7" />
    <Text style={styles.title}>{title}</Text>
  </TouchableOpacity>
);

const Test = ({ navigation }) => {
  const [documents, setDocuments] = useState([]);
  const [recentDocuments, setRecentDocuments] = useState([]);

  const handleDocumentUpload = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      console.log('Document selected:', res);
      // Categorize the documents and update state
      const categorizedDocuments = categorizeDocument(res);
      setDocuments(prevDocs => [...prevDocs, ...categorizedDocuments]);

      // Update recent documents list
      setRecentDocuments(prevRecentDocs => {
        // Add new documents to the start of the list
        const updatedRecentDocs = [...categorizedDocuments, ...prevRecentDocs];
        // Keep only the most recent 3 documents
        return updatedRecentDocs.slice(0, 3);
      });

      Alert.alert('File Selected', `You have selected: ${res.map(doc => doc.name).join(', ')}`);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
        console.log('User cancelled document picker');
      } else {
        console.error('Document picker error:', err);
        throw err;
      }
    }
  };

  const handleItemPress = (title) => {
    const filteredDocuments = documents.filter(doc => doc.category === title);
    navigation.navigate('Test1', { documents: filteredDocuments });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          style={styles.profileImage}
          source={{ uri: 'https://via.placeholder.com/150' }} // Replace with actual image URL or local image
        />
        <Text style={styles.greeting}>Hello, Ronald Richards 👋</Text>
      </View>
      <TextInput
        style={styles.searchInput}
        placeholder="Search here"
        placeholderTextColor="#888"
      />
      <View style={styles.storage}>
        <Icon name="folder-open-outline" size={30} color="#4F8EF7" />
        <View style={styles.storageInfo}>
          <Text>Internal Storage</Text>
          <Text>5 GB / 3.6 GB Used</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.detailsText}>See Details</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.uploadButton} onPress={handleDocumentUpload}>
        <Text style={styles.uploadButtonText}>Upload Document</Text>
      </TouchableOpacity>

      <FlatList
        data={DATA}
        renderItem={({ item }) => (
          <Item
            title={item.title}
            icon={item.icon}
            onPress={handleItemPress}
          />
        )}
        keyExtractor={item => item.id}
        numColumns={3}
        columnWrapperStyle={styles.row}
      />

      {/* Recent Documents Section */}
      <View style={styles.recentDocuments}>
        <Text style={styles.recentTitle}>Recent Documents</Text>
        <FlatList
          data={recentDocuments}
          renderItem={({ item }) => (
            <View style={styles.recentItem}>
              <Text>{item.name}</Text>
            </View>
          )}
          keyExtractor={item => item.uri}
          horizontal
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  greeting: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    marginBottom: 20,
  },
  storage: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginBottom: 20,
  },
  storageInfo: {
    flex: 1,
    marginLeft: 10,
  },
  detailsText: {
    color: '#4F8EF7',
  },
  uploadButton: {
    backgroundColor: '#4F8EF7',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  list: {
    alignItems: 'center',
  },
  row: {
    // flex: 1,
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  item: {
    alignItems: 'center',
    width: 100,
    borderRadius: 10,
    borderWidth: 1,
    padding: 15,
  },
  title: {
    marginTop: 5,
    textAlign: 'center',
  },
  recentDocuments: {
    marginBottom: 20,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  recentItem: {
    padding: 10,
    marginRight: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
});

export default Test;
