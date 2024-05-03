import * as yup from 'yup'

export const LoginInitialValue = {
    email : '',
    password : ''
}

export const loginValidtionSchema = yup.object().shape({
    email:yup.string().required('Email is required'),
    password:yup.string().required('Password is required')
})
export const profileInitialValue = {
    first_name : '',
    last_name : '',
    email : '',
    mobile : ''
}

export const profileValidtionSchema = yup.object().shape({
    first_name:yup.string().required('FirstNaame is required'),
    lastname:yup.string().required('LastName is required'),
    email:yup.string().required('Email is required'),
    mobile:yup.string().required('Mobile is required'),
})
export const SignupInitialValue = {
    name : '',
    email : '',
    password : '',
    cpassword : '',
}

export const SignupValidtionSchema = yup.object().shape({
    name : yup.string().required('Name is required'),
    email : yup.string().required('Email is required'),
    password:yup.string().required('Password is required'),
    cpassword:yup.string().required('Confirm Password is required')
})