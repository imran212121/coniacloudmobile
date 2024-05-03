import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { Formik } from 'formik'
import { SignupInitialValue, SignupValidtionSchema } from './utils'
import InputBox from '../../components/InputBox'
import CustomButton from '../../components/CustomButton'
import { useNavigation } from '@react-navigation/native'

const Signup = () => {
    const navigation = useNavigation();
    const handleSignup = () => {
        //console.log("Signup");
    }
    return (
        <View style={styles.loginMainContainer}>
            <View style={styles.logoContainer}>
                <Image source={require('../../assets/logo.png')} style={styles.logoImage} />
                <Formik
                    initialValues={SignupInitialValue}
                    validationSchema={SignupValidtionSchema}
                    onSubmit={handleSignup}
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
                        <View>
                            <InputBox
                                placeholder={'Name'}
                                onChangeText={handleChange('name')}
                                onBlur={handleBlur('name')}
                                value={values.name}
                                touched={touched.name}
                                errors={errors.name} />

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

                            <InputBox
                                placeholder={'Confirm Password'}
                                onChangeText={handleChange('cpassword')}
                                onBlur={handleBlur('cpassword')}
                                value={values.cpassword}
                                touched={touched.cpassword}
                                errors={errors.cpassword}
                                secureTextEntry={false} />

                            <CustomButton buttonTitle={'Sign up'} onPress={handleSubmit} />
                        </View>
                    )
                }}

                </Formik>
            </View>
            <View style={styles.signUpButton}>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text>
                        Have an account? <Text style={{ color: '#3797FE' }}>Log in</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Signup

const styles = StyleSheet.create({
    loginMainContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    logoContainer: {
        flex: 0.8,
        justifyContent: 'center'
    },
    logoImage: {
        width: 100,
        height: 70,
        marginBottom: 20,
        alignSelf: 'center'

    },
    signUpButton: {
        flex: 0.2,
        marginBottom: 20,
        justifyContent: 'flex-end'
    }
})