// ExampleComponent.js
import React from 'react';
import { View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { selectLanguage } from './src/redux/reducers/languageSlice';
import strings from './src/helper/Language/LocalizedStrings'; // Import your localized strings

const ExampleComponent = () => {
  const currentLanguage = useSelector(selectLanguage);

  return (
    <View>
      <Text>{strings.WELCOME_TEXT}</Text>
      <Text>{strings.GREETING}</Text>
    </View>
  );
};

export default ExampleComponent;
