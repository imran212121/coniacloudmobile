import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import { updatepasswordValidtionSchema } from '../auth/utils';
import { baseURL } from '../../constant/settings';
import InputBox from '../../components/InputBox';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { AppColor } from '../../utils/AppColors';
import { AlertNotificationRoot, Dialog, ALERT_TYPE } from 'react-native-alert-notification';
import CustomHeader from '../../components/CustomHeader';
import { makeApiCall } from '../../helper/apiHelper';


import { setLanguage } from '../../redux/reducers/languageSlice'; 
import strings from '../../helper/Language/LocalizedStrings';

const UpdatePassword = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [profileInitialValue, setProfileInitialValue] = useState({
    current_password:  '',
    new_password:  '',
    new_password_confirmation:  '',
  });
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const loading = useSelector((state) => state.auth.loading);
  const error = useSelector((state) => state.auth.error);
  const { user } = useSelector((state) => state.auth);
  const [err , setErr] = useState('')
  const language = useSelector((state) => state.language.language);
  useEffect(() => {
    if (!user) {
      navigation.navigate('Login');
    } 
  }, [user, navigation]);

  const handleUpdate = async (values) => {
  console.log('customValidate(profileInitialValue)',customValidate(profileInitialValue));
    try {
      if(customValidate(profileInitialValue)===0)
        {
          const token = await makeApiCall('api/v1/users/me/password/change', user?.access_token, 'post',profileInitialValue);
    
              console.log('handleProfile',updateUser);
              Dialog.show({
                type: ALERT_TYPE.SUCCESS,
                title: 'Success',
                textBody: 'Password uploaded successful',
                button: 'close'
              });
        }
   
    } catch (error) {
        console.log(error._response);
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: 'Warning',
        textBody: error.message,
        button: 'close'
      });
    }
  };

  const handleChanges = (name, value) => {
    setProfileInitialValue((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }
  const customValidate = (values) => {
    const errors = {};
      console.log('values',values);
    if (!values.current_password) {
      errors.current_password = 'Current password is required';
    } 
  
    if (!values.new_password) {
      errors.new_password = 'New password  is required';
    } else if (values.new_password.length < 6) {
      errors.new_password = 'New password  is too short!';
    } else if (values.new_password.length > 50) {
      errors.new_password = 'New password  is too long!';
    }
  
    if (!values.new_password_confirmation) {
      errors.new_password_confirmation = 'Confirm Password is required';
    } else if (values.new_password_confirmation!==values.new_password) {
      errors.new_password_confirmation = 'Confirm Password does not match.';
    }
  
    
    setErr(errors);
    return Object.keys(errors).length;
  };
  
  return (
    <AlertNotificationRoot>
      <ScrollView style={styles.container}>
        <CustomHeader back={true} OnPress={()=>{
          navigation.navigate('User')
        }} left={true}  title={strings.UPDATE_PASSWORD} />
        <View style={styles.inputContainer}>
          <Formik
            enableReinitialize
            initialValues={profileInitialValue}
            validationSchema={updatepasswordValidtionSchema}
            onSubmit={handleUpdate}
          >
            {({
             
             handleChange,
             handleBlur,
             handleSubmit,
             values,
             touched,
             errors,
             isValid=false
              
            }) => (
              <View style={{ marginTop: 100 }}>
                <InputBox
                  placeholder="Current Password"
                  onChangeText={(e) => handleChanges('current_password', e)}
                  onBlur={handleBlur('current_password')}
                  value={values.current_password}
                  touched={err.current_password}
                  errors={err.current_password}
                />
                <InputBox
                  placeholder="New Password"
                  onChangeText={(e) => handleChanges('new_password', e)}
                  onBlur={handleBlur('new_password')}
                  value={values.new_password}
                  touched={err.new_password}
                  errors={err.new_password}
                />
                <InputBox
                  placeholder="Confirm Password"
                  onChangeText={(e) => handleChanges('new_password_confirmation', e)}
                  onBlur={handleBlur('new_password_confirmation')}
                  value={values.new_password_confirmation}
                  touched={err.new_password_confirmation}
                  editable={false}
                  errors={err.new_password_confirmation}
                />
                
                <CustomButton buttonTitle={strings.UPDATE_PASSWORD} onPress={handleUpdate} />
              </View>
            )}
          </Formik>
        </View>
      </ScrollView>
    </AlertNotificationRoot>
  );
};

export default UpdatePassword;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F1F1F1',
    flexDirection: 'column'
  },
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: AppColor.bgcolor,
  },
  headerContainer: {
    width: '100%',
    height: 52,
    borderBottomWidth: 1,
    borderBottomColor: '#e6e6e6',
    flexDirection: 'row'
  },
  headerText: {
    fontWeight: '600',
    fontSize: 20,
    padding: 10,
    width: 150,
  },
  headerImage: {
    width: 50,
    height: 50,
  },
  inputContainer: {
    alignItems: 'center'
  },
  signUpButton: {
    flex: 0.2,
    marginBottom: 20,
    justifyContent: 'flex-end'
  }
});
