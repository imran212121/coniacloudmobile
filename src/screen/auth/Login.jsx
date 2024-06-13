import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import { Formik } from 'formik';
import { LoginInitialValue, loginValidationSchema } from './utils';
import InputBox from '../../components/InputBox';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../redux/actions/authActions';
import { loginAsync } from '../../redux/reducers/authSlice';
import Alertm from '../../components/alert/Alertm';

const Login = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { isLoggedIn, loading, error,user } = useSelector((state) => state.auth);

    useEffect(() => {
        console.log('user*****************************',user,isLoggedIn);
        if (user!==null) {
            navigation.navigate('Dashboard');
        }
    }, [isLoggedIn, navigation,dispatch]);

    const handleLogin = async (values) => {
        const { email, password } = values;
        console.log('Login start');
       dispatch(loginAsync({ email, password, token_name: 'android' }))
        // await dispatch(loginUser({ email, password, token_name: 'android' }))
        //     .then((data) => {
        //         if (data.type === "auth/loginUser/fulfilled") {
        //             navigation.navigate('Dashboard');
        //         }
        //     })
        //     .catch((error) => {
        //         console.error('Login failed', error);
        //     });
    };

    return (
        <View style={styles.loginMainContainer}>
            <View style={styles.logoContainer}>
                <Image source={require('../../assets/logo1.png')} style={styles.logoImage} />
            </View>
            <View style={styles.inputContainer}>
                <View style={{ alignItems: 'center', height: 33 }}>
                    <Text style={{ color: '#263c69', fontSize: 22, fontWeight: '700' }}>Sign in to your account</Text>
                </View>
                {error && <Alertm type={'error'} text={'Invalid username or password!'} />}
                <Formik
                    initialValues={LoginInitialValue}
                    validationSchema={loginValidationSchema}
                    onSubmit={handleLogin}
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
                        <View style={{ marginTop: 60 }}>
                            <InputBox
                                placeholder={'Email'}
                                onChangeText={handleChange('email')}
                                onBlur={handleBlur('email')}
                                value={values.email}
                                touched={touched.email}
                                errors={errors.email}
                            />

                            <InputBox
                                placeholder={'Password'}
                                onChangeText={handleChange('password')}
                                onBlur={handleBlur('password')}
                                value={values.password}
                                touched={touched.password}
                                errors={errors.password}
                                secureTextEntry
                            />

                            <CustomButton buttonTitle={'Log in'} onPress={handleSubmit} disabled={!isValid || loading} />
                        </View>
                    )}
                </Formik>
            </View>
            <View style={styles.signUpButton}>
                <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                    <Text style={{ color: '#3797FE' }}>Sign up</Text>
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

export default Login;

const styles = StyleSheet.create({
    loginMainContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white'
    },
    logoContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row-reverse',
        flex: 0.2
    },
    logoImage: {
        marginRight: 34
    },
    inputContainer: {
        flex: 0.6,
        justifyContent: 'flex-start',
    },
    signUpButton: {
        flex: 0.2,
        marginBottom: 20,
        justifyContent: 'flex-end'
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
    }
});
