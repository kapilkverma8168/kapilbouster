// validationSchemas.js

import * as Yup from 'yup';

export const clientValidationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    mobile: Yup.string().required('Mobile is required'),
    password: Yup.string().required('Password is required'),
    contact_name: Yup.string().required('Contact Name is required'),
    address: Yup.string().required('Address is required'),
    country: Yup.string().required('Country is required'),
    state: Yup.string().required('State is required'),
    cities: Yup.string().required('City is required'),
    pincode: Yup.string().required('Pincode is required')
});


export const clientValidationEditSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    mobile: Yup.string().required('Mobile is required'),
    password: Yup.string().required('Password is required'),
    contact_name: Yup.string().required('Contact Name is required'),
    address: Yup.string().required('Address is required'),
    country: Yup.string().required('Country is required'),
    state: Yup.string().required('State is required'),
    city: Yup.string().required('City is required'),
    pincode: Yup.string().required('Pincode is required')
});
