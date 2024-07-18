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
    company:yup.string().notRequired('Company name must be string'),
    mobile:yup.string().notRequired('Mobile is required'),
})
export const updatepasswordValidtionSchema = yup.object().shape({
    current_password:yup.string().required('Current password is required'),
    new_password:yup.string().required('New password is required'),
    new_password_confirmation:yup.string().required('Confirm password is required'),
   
})

export const SignupInitialValue = {
    firstname : '',
    Lastname : '',
    email : '',
    password : '',
    
}

export const SignupValidtionSchema = yup.object().shape({
    firstname : yup.string().required('Name is required'),
    Lastname : yup.string().required('Name is required'),
    email : yup.string().required('Email is required'),
    password:yup.string().required('Password is required')
})