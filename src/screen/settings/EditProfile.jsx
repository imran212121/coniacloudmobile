import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import { profileValidtionSchema } from '../auth/utils';
import { baseURL } from '../../constant/settings';
import InputBox from '../../components/InputBox';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { AppColor } from '../../utils/AppColors';
import { AlertNotificationRoot, Dialog, ALERT_TYPE } from 'react-native-alert-notification';
import CustomHeader from '../../components/CustomHeader';
import { makeApiCall } from '../../helper/apiHelper';
import { updateUserAsync } from '../../redux/reducers/authSlice';

const EditProfile = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [profileInitialValue, setProfileInitialValue] = useState({
    first_name: '',
    last_name: '',
    email: '',
    mobile: '',
    company: '',
    designation: ''
  });
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const loading = useSelector((state) => state.auth.loading);
  const error = useSelector((state) => state.auth.error);
  const { user } = useSelector((state) => state.auth);
  const [err , setErr] = useState('')

  useEffect(() => {
    if (!user) {
      navigation.navigate('Login');
    } else {
      setProfileInitialValue({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        email: user?.email || '',
        mobile: user?.mobile || '',
        company: user?.company || '',
        designation: user?.designation || ''
      });
    }
  }, [user, navigation]);

  const handleProfile = async (values) => {
  console.log('customValidate(profileInitialValue)',customValidate(profileInitialValue));
    try {
      if(customValidate(profileInitialValue)===0)
        {
           const updateUser = await dispatch(updateUserAsync(profileInitialValue)).unwrap()
              console.log('handleProfile',updateUser);
              Dialog.show({
                type: ALERT_TYPE.SUCCESS,
                title: 'Success',
                textBody: 'Upload successful',
                button: 'close'
              });
        }
   
    } catch (error) {
        console.log(error);
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
    if (!values.first_name) {
      errors.first_name = 'First name is required';
    } else if (values.first_name.length < 2) {
      errors.first_name = 'First name is too short!';
    } else if (values.first_name.length > 50) {
      errors.first_name = 'First name is too long!';
    }
  
    if (!values.last_name) {
      errors.last_name = 'Last name is required';
    } else if (values.last_name.length < 2) {
      errors.last_name = 'Last name is too short!';
    } else if (values.last_name.length > 50) {
      errors.last_name = 'Last name is too long!';
    }
  
    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'Invalid email address';
    }
  
    if (!values.mobile) {
      errors.mobile = 'Mobile number is required';
    } else if (!/^[0-9]+$/.test(values.mobile)) {
      //errors.mobile = 'Mobile number must be digits';
    } else if (values.mobile.length < 10) {
      errors.mobile = 'Mobile number is too short';
    } else if (values.mobile.length > 15) {
      errors.mobile = 'Mobile number is too long';
    }
  
    if (!values.company) {
      errors.company = 'Company is required';
    }
  
    if (!values.designation) {
      errors.designation = 'Designation is required';
    }
    console.log('errors',Object.keys(errors).length);
    setErr(errors);
    return Object.keys(errors).length;
  };
  
  return (
    <AlertNotificationRoot>
      <ScrollView style={styles.container}>
        <CustomHeader back={true} OnPress={()=>{
          navigation.navigate('User')
        }} left={true} right={true} title={"Account Details"} />
        <View style={styles.inputContainer}>
          <Formik
            enableReinitialize
            initialValues={profileInitialValue}
            validationSchema={profileValidtionSchema}
            onSubmit={handleProfile}
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
                  placeholder="First Name"
                  onChangeText={(e) => handleChanges('first_name', e)}
                  onBlur={handleBlur('first_name')}
                  value={values.first_name}
                  touched={touched.first_name}
                  errors={err.first_name}
                />
                <InputBox
                  placeholder="Last Name"
                  onChangeText={(e) => handleChanges('last_name', e)}
                  onBlur={handleBlur('last_name')}
                  value={values.last_name}
                  touched={err.last_name}
                  errors={err.last_name}
                />
                <InputBox
                  placeholder="Email"
                  value={values.email}
                  touched={err.email}
                  editable={false}
                  errors={err.email}
                />
                <InputBox
                  placeholder="Company"
                  onChangeText={(e) => handleChanges('company', e)}
                  onBlur={handleBlur('company')}
                  value={values.company}
                  touched={err.company}
                  errors={err.company}
                />
                <InputBox
                  placeholder="Designation"
                  onChangeText={(e) => handleChanges('designation', e)}
                  onBlur={handleBlur('designation')}
                  value={values.designation}
                  touched={err.designation}
                  errors={err.designation}
                />
                <InputBox
                  placeholder="Mobile"
                  onChangeText={(e) => handleChanges('mobile', e)}
                  onBlur={handleBlur('mobile')}
                  value={values.mobile}
                  touched={err.mobile}
                  errors={err.mobile}
                />
                <CustomButton buttonTitle={'Update'} onPress={handleProfile} />
              </View>
            )}
          </Formik>
        </View>
      </ScrollView>
    </AlertNotificationRoot>
  );
};

export default EditProfile;

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
