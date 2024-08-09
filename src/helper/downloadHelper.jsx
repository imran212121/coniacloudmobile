import RNFetchBlob from 'rn-fetch-blob';
import { Platform, PermissionsAndroid } from 'react-native';

// Grant permission in Android
export const getDownloadPermissionAndroid = async () => {
  try {
    const hasPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
    console.log('Has storage permission:', hasPermission);
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'File Download Permission',
        message: 'Your permission is required to save files to your device',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.log('Error requesting storage permission', err);
    return false;
  }
};

export const downloadFile = async (url, filename) => {
  const { config, fs } = RNFetchBlob;
  
  const cacheDir = fs.dirs.DownloadDir;
  const fileExtension = filename.split('.').pop();
  const filePath = `${cacheDir}/${filename}`;

  console.log('filePath:', filePath);
  console.log('fileExtension:', fileExtension);

  try {
    const configOptions = Platform.select({
      ios: {
        fileCache: true,
        path: filePath,
        appendExt: fileExtension,
      },
      android: {
        fileCache: true,
        path: filePath,
        appendExt: fileExtension,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: filePath,
          description: 'File',
        },
      },
    });

    const response = await RNFetchBlob.config(configOptions).fetch('GET', url);

    console.log('File downloaded to:', response.path());
    return response.path();
  } catch (error) {
    console.error('Download file error:', error);
    return null;
  }
};
