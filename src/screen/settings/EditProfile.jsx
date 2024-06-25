import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { Formik } from 'formik'
import { profileInitialValue, profileValidtionSchema } from '../auth/utils'
import InputBox from '../../components/InputBox'
import CustomButton from '../../components/CustomButton'
import { useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux';
import { loginAsync } from '../../redux/reducers/authSlice'
const EditProfile = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const loading = useSelector((state) => state.auth.loading);
    const error = useSelector((state) => state.auth.error);
    const handleProfile = (values) => {
        const { first_name,last_name,mobile,email} = values;
       //console.log(first_name,last_name,mobile,email);
    }
    if (loading) {
        return <Text>Loading</Text>;
    }
    return (
        <View style={styles.mainContainer}>
            <View style={styles.headerContainer} >
            <Image source={require('../../assets/icons/back.png')}  style={styles.headerImage}/>
               <Text style={styles.headerText}>Edit Profile</Text> 
            </View>
            <View style={styles.inputContainer}>
               
                <Formik
                    initialValues={profileInitialValue}
                    validationSchema={profileValidtionSchema}
                    onSubmit={handleProfile}
                >{({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    values,
                    touched,
                    errors,
                    isValid
                }) => {
                    return (
                        <View style={{ marginTop: 100 }}>
                            <InputBox
                                placeholder={'First Name'}
                                onChangeText={handleChange('first_name')}
                                onBlur={handleBlur('first_name')}
                                value={values.first_name}
                                touched={touched.first_name}
                                errors={errors.first_name} />
                            <InputBox
                                placeholder={'Last Name'}
                                onChangeText={handleChange('last_name')}
                                onBlur={handleBlur('last_name')}
                                value={values.last_name}
                                touched={touched.last_name}
                                errors={errors.last_name} />  
                               <InputBox
                                placeholder={'Email'}
                                onChangeText={handleChange('email')}
                                onBlur={handleBlur('email')}
                                value={values.email}
                                touched={touched.email}
                                errors={errors.email} />  
                                 <InputBox
                                placeholder={'Mobile'}
                                onChangeText={handleChange('mobile')}
                                onBlur={handleBlur('mobile')}
                                value={values.mobile}
                                touched={touched.mobile}
                                errors={errors.mobile} /> 

                            <CustomButton buttonTitle={'Log in'} onPress={handleSubmit} />
                        </View>
                    )
                }}

                </Formik>
            </View>
            <View style={styles.signUpButton}>
                <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                    <Text style={{ color: '#3797FE' }}>Sign up</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default EditProfile

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#F1F1F1',
        flexDirection:'column'
    },
    headerContainer: {
        width: '100%',
        height: 52,
        borderBottomWidth: 1,
        borderBottomColor: '#e6e6e6',
        
        flexDirection:'row'
    },
    headerText:{
        fontWeight: '600',
        fontSize: 20,
        padding: 10,
        width:150,
       
    },
    headerImage:{
        width:50,
        height:50,
       
    },
   
    inputContainer: {
       alignItems:'center'
       
    },
    signUpButton: {
        flex: 0.2,
        marginBottom: 20,
        justifyContent: 'flex-end'
    }
})
