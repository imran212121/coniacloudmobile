import 'react-native-gesture-handler';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Provider, useDispatch } from 'react-redux';
import StackNavigation from './src/navigator/StackNavigation';
import store from './src/redux/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setLanguage } from './src/redux/reducers/languageSlice';
function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  // const changelanguage= useDispatch();
  // useEffect(() => {
  //   const loadLanguage = async () => {
  //     const savedLanguage = await AsyncStorage.getItem('language');
  //     if (savedLanguage) {
  //       store.dispatch(setLanguage(savedLanguage)); // Dispatch action to set language
  //       // strings.setLanguage(savedLanguage); // Assuming strings is imported properly
  //     }
  //   };

  //   loadLanguage();
  // }, []);

  return (
   
 <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <View style={{ flex: 1 }}>
          <StackNavigation />
        </View>
      </Provider>
    </GestureHandlerRootView>
    
   
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
