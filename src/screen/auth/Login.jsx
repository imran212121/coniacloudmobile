import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { Formik } from 'formik'
import { LoginInitialValue, loginValidtionSchema } from './utils'
import InputBox from '../../components/InputBox'
import CustomButton from '../../components/CustomButton'
import { useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux';
import { loginAsync } from '../../redux/reducers/authSlice'
const Login = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const loading = useSelector((state) => state.auth.loading);
    const error = useSelector((state) => state.auth.error);
    const handleLogin = (values) => {
        const { email, password } = values;
        dispatch(loginAsync({ email, password,token_name:'android' }));
        navigation.navigate('Dashboard');
    }
    if (loading) {
        return <Text>Loading</Text>;
      }
    return (
        <View style={styles.loginMainContainer}>
            <View style={styles.logoContainer}>
                <Image source={require('../../assets/logo1.png')} style={styles.logoImage} />
            </View>
                <View style={styles.inputContainer}>
                <View style={{alignItems:'center',height:33}}>
                    <Text style={{color:'#263c69',fontSize:22,fontWeight:700}}>Sign in to your account</Text>
                </View>
                <Formik
                    initialValues={LoginInitialValue}
                    validationSchema={loginValidtionSchema}
                    onSubmit={handleLogin}
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
                        <View style={{marginTop:100}}>
                            <InputBox
                                placeholder={'Email'}
                                onChangeText={handleChange('email')}
                                onBlur={handleBlur('email')}
                                value={values.email}
                                touched={touched.email}
                                errors={errors.email} />

                            <InputBox
                                placeholder={'Password'}
                                onChangeText={handleChange('password')}
                                onBlur={handleBlur('password')}
                                value={values.password}
                                touched={touched.password}
                                errors={errors.password}
                                secureTextEntry={true} />

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

export default Login

const styles = StyleSheet.create({
    loginMainContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor:'white'
    },
    logoContainer: {
     width:'100%',
    
     display:'flex',
     flexDirection:'row-reverse',
     flex:0.2   
    },
    logoImage: {
     marginRight:34
    },
    inputContainer: {
        flex: 0.6,
        justifyContent:'flex-start',
        
    },
 
    signUpButton: {
        flex: 0.2,
        marginBottom: 20,
        justifyContent: 'flex-end'
    }
})