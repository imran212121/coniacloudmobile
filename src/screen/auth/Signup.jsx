// import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
// import React from 'react'
// import { Formik } from 'formik'
// import { SignupInitialValue, SignupValidtionSchema } from './utils'
// import InputBox from '../../components/InputBox'
// import CustomButton from '../../components/CustomButton'
// import { useNavigation } from '@react-navigation/native'

// const Signup = () => {
//     const navigation = useNavigation();
//     const handleSignup = () => {
//         ////console.log("Signup");
//     }
//     return (
//         <View style={styles.loginMainContainer}>
//             <View style={styles.logoContainer}>
//                 <Image source={require('../../assets/logo.png')} style={styles.logoImage} />
//                 <Formik
//                     initialValues={SignupInitialValue}
//                     validationSchema={SignupValidtionSchema}
//                     onSubmit={handleSignup}
//                 >{({
//                     handleChange,
//                     handleBlur,
//                     handleSubmit,
//                     values,
//                     touched,
//                     errors,
//                     isValid
//                 }) => {
//                     return (
//                         <View>
//                             <InputBox
//                                 placeholder={'Name'}
//                                 onChangeText={handleChange('name')}
//                                 onBlur={handleBlur('name')}
//                                 value={values.name}
//                                 touched={touched.name}
//                                 errors={errors.name} />

//                             <InputBox
//                                 placeholder={'Email'}
//                                 onChangeText={handleChange('email')}
//                                 onBlur={handleBlur('email')}
//                                 value={values.email}
//                                 touched={touched.email}
//                                 errors={errors.email} />

//                             <InputBox
//                                 placeholder={'Password'}
//                                 onChangeText={handleChange('password')}
//                                 onBlur={handleBlur('password')}
//                                 value={values.password}
//                                 touched={touched.password}
//                                 errors={errors.password}
//                                 secureTextEntry={true} />

//                             <InputBox
//                                 placeholder={'Confirm Password'}
//                                 onChangeText={handleChange('cpassword')}
//                                 onBlur={handleBlur('cpassword')}
//                                 value={values.cpassword}
//                                 touched={touched.cpassword}
//                                 errors={errors.cpassword}
//                                 secureTextEntry={false} />

//                             <CustomButton buttonTitle={'Sign up'} onPress={handleSubmit} />
//                         </View>
//                     )
//                 }}

//                 </Formik>
//             </View>
//             <View style={styles.signUpButton}>
//                 <TouchableOpacity onPress={() => navigation.navigate('Login')}>
//                     <Text>
//                         Have an account? <Text style={{ color: '#3797FE' }}>Log in</Text>
//                     </Text>
//                 </TouchableOpacity>
//             </View>
//         </View>
//     )
// }

// export default Signup

// const styles = StyleSheet.create({
//     loginMainContainer: {
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'space-between'
//     },
//     logoContainer: {
//         flex: 0.8,
//         justifyContent: 'center'
//     },
//     logoImage: {
//         width: 100,
//         height: 70,
//         marginBottom: 20,
//         alignSelf: 'center'

//     },
//     signUpButton: {
//         flex: 0.2,
//         marginBottom: 20,
//         justifyContent: 'flex-end'
//     }
// })
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import { Formik } from 'formik';
import { LoginInitialValue, SignupInitialValue, SignupValidtionSchema, loginValidationSchema } from './utils';
import InputBox from '../../components/InputBox';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../redux/actions/authActions';
import { loginAsync } from '../../redux/reducers/authSlice';
import Alertm from '../../components/alert/Alertm';
import CustomHeader from '../../components/CustomHeader';
import { AppColor } from '../../utils/AppColors';

const Signup = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { isLoggedIn, loading, error, user } = useSelector((state) => state.auth);
    const handleSignup = () => {
        //console.log("Signup");
    }


    return (
        <View style={styles.loginMainContainer}>
            <CustomHeader back={true} left={true} title={'Hey There!'}
                OnPress={() => navigation.goBack()} />
            <View style={styles.logoContainer}>
                <Text style={styles.text}>Let’s get to know each other, input personal details to begin</Text>
                {/* <Image source={require('../../assets/logo1.png')} style={styles.logoImage} /> */}
            </View>
            <View style={styles.inputContainer}>
                {/* <View style={{ alignItems: 'center', height: 33 }}>
                    <Text style={{ color: '#263c69', fontSize: 22, fontWeight: '700' }}>Sign in to your account</Text>
                </View> */}
                {error && <Alertm type={'error'} text={'Invalid username or password!'} />}
                <Formik
                    initialValues={SignupInitialValue}
                    validationSchema={SignupValidtionSchema}
                 onSubmit={handleSignup}
                >
                    {({
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        values,
                        touched,
                        errors,
                        isValid
                    }) => (
                        <View style={{ marginTop: 80, }}>
                            <InputBox
                                placeholder={'First Name'}
                                 onChangeText={handleChange('firstname')}
                                onBlur={handleBlur('firstname')}
                               
                                value={values.firstname}
                                icon={require('../../assets/icons/user.png')}
                                touched={touched.firstname}
                                errors={errors.firstname} />
                            <InputBox
                                placeholder={'Last Name'} 
                                onChangeText={handleChange('Lastname')}
                                onBlur={handleBlur('Lastname')}
                                value={values.Lastname}
                                touched={touched.Lastname}
                                icon={require('../../assets/icons/user.png')}
                                errors={errors.Lastname} />
                            <InputBox
                                placeholder={'Enter email Address'}
                                onChangeText={handleChange('email')}
                                onBlur={handleBlur('email')}
                                value={values.email}
                                touched={touched.email}
                                errors={errors.email}
                                icon={require('../../assets/icons/mail.png')}
                            />

                            <InputBox
                                placeholder={'Password'}
                                onChangeText={handleChange('password')}
                                onBlur={handleBlur('password')}
                                value={values.password}
                                touched={touched.password}
                                errors={errors.password}
                                secureTextEntry
                                secure={true}
                                icon={require('../../assets/Lock.png')}
                            />
                          
                            <View style={{marginTop:40}}>
                            <CustomButton buttonTitle={'Sign in'} disabled={!isValid || loading} onPress={handleSubmit}/>
                            </View>
                        </View>
                    )}
                </Formik>
            </View>
            <View style={styles.signUpButton}>
                <Text style={styles.text}>Already a User?  </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={[styles.text, { color: AppColor.blue, fontSize: 16, marginTop: 5 }]}>Log in to your account</Text>
                </TouchableOpacity>
            </View>
            {loading && (
                <View style={styles.loadingOverlay}>
                    <Text>Loading...</Text>
                </View>
            )}
        </View>
    );
};

export default Signup;

const styles = StyleSheet.create({
    loginMainContainer: {
        flex: 1,
        alignItems: 'center',
        // justifyContent: 'space-between',
        backgroundColor: 'white',
        padding: 15
    },
    logoContainer: {
        width: '70%',
        position: 'absolute',
        top: 60

    },
    // logoImage: {
    //     height: 100,
    //     width: 100,
    //     alignSelf: 'center',
    //     resizeMode: 'contain'
    // },
    inputContainer: {
        // flex: 0.6,
        // justifyContent: 'flex-start',
        // marginTop:30
    },
    signUpButton: {
        marginTop:50
        

    },
    loadingOverlay: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)'
    },
    text: {
        color: AppColor.textSecondery,
        fontSize: 14,
        lineHeight: 18,
        textAlign: 'center',
        fontWeight: '400'
    },
    Forget: {
        color: AppColor.textSecondery,
        fontSize: 14,
        lineHeight: 18,
        textAlign: 'center',
        alignSelf: 'flex-end',
        fontWeight: '400',
        padding: 10,
        paddingBottom: 40
    }
});
