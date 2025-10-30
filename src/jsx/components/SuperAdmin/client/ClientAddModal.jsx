import React, { useContext, useState } from 'react'
// import Form from 'react-bootstrap/Form';

import swal from "sweetalert";
import { Modal } from 'react-bootstrap';
import { nanoid } from 'nanoid';
import { CreateAllClientList, UploadClientLogo } from '../../../../services/superadminService/ClientService';
import notify from '../../../../utils/notification';
import { EyePasswordBtn } from '../../../../common/ui/view/CustomEyePasswordBtn';
import { FileUploadService } from '../../../../config/apiServices';
import { LocationContext } from '../../../../context/LocationContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { clientValidationSchema } from './ValidationSchemas';

const ClientAddModal = ({ addCard, setAddCard, ClientListApi }) => {
    const { countries, states, cities, fetchStates, fetchCities } = useContext(LocationContext);

    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [addFormData, setAddFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        password: '',
        contact_name: '',
        address: '',
        city: '',
        state: '',
        country: '',
        pincode: '',


    });
    const [contents, setContents] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    

    const handleAddFormChange = (event) => {
        const { name, value } = event.target;
        setAddFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleCountryChange = (e) => {
        const countryId = e.target.value;
        setSelectedCountry(countryId);
        setAddFormData((prevFormData) => ({
            ...prevFormData,
            country: countryId,
        }));
        fetchStates(countryId);
    };

    const handleStateChange = (e) => {
        const stateId = e.target.value;
        setSelectedState(stateId);
        setAddFormData((prevFormData) => ({
            ...prevFormData,
            state: stateId,
        }));
        fetchCities(stateId);
    };

    const handleCitesChange = (e) => {
        const cityId = e.target.value;

        setAddFormData((prevFormData) => ({
            ...prevFormData,
            state: cityId,
        }));

    };




    //Add Submit data
    const handleAddFormSubmit = async (values, { setErrors }) => {
        const newContent = {
            name: values.name,
            email: values.email,
            mobile: values.mobile,
            password: values.password,
            contact_name: values.contact_name,
            address: values.address,
            city: values.cities,
            state: values.state,
            country: values.country,
            pincode: values.pincode,
        };

        try {
            setLoading(true);
            const response = await CreateAllClientList(newContent);

            if (response?.data?.status === true) {
                swal(`${response?.data?.message}`);
                ClientListApi();
                setAddCard(false);
            } else {
                if (response.data.message) {
                    setErrors(response.data.message);
                } else {
                    notify('error', response.data.message);
                }
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                if (error.response.data.message) {
                    setErrors(error.response.data.message);
                } else {
                    notify('error', error.response.data.message);
                }
            } else {
                notify('error', 'An unexpected error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            <Modal className="modal fade" show={addCard} onHide={() => setAddCard(false)}>
                <div role="document">
                    <div>
                        <Formik
                            initialValues={{
                                name: '',
                                email: '',
                                mobile: '',
                                password: '',
                                contact_name: '',
                                address: '',
                                country: '',
                                state: '',
                                cities: '',
                                pincode: ''
                            }}
                            validationSchema={clientValidationSchema}
                            onSubmit={handleAddFormSubmit}
                        >
                            {({ errors, touched, setFieldValue }) => (
                                <Form>
                                    <div className="modal-header">
                                        <h4 className="modal-title fs-20">Add Client</h4>
                                        <button type="button" className="btn-close" onClick={() => setAddCard(false)}><span></span></button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="add-contact-box">
                                            <div className="add-contact-content">
                                                {/* Form Fields */}
                                                <div className="row">
                                                    <div className="form-group mb-3 col-md-6">
                                                        <label className="text-black font-w500">Name <span className="text-danger">*</span></label>
                                                        <Field name="name" className="form-control" placeholder="Name" />
                                                        <ErrorMessage name="name" component="div" className="validation-text" />
                                                    </div>
                                                    <div className="form-group mb-3 col-md-6">
                                                        <label className="text-black font-w500">Email <span className="text-danger">*</span></label>
                                                        <Field name="email" className="form-control" placeholder="Email" />
                                                        <ErrorMessage name="email" component="div" className="validation-text" />
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="form-group mb-3 col-md-6">
                                                        <label className="text-black font-w500">Mobile <span className="text-danger">*</span></label>
                                                        <Field name="mobile" className="form-control" placeholder="Mobile" />
                                                        <ErrorMessage name="mobile" component="div" className="validation-text" />
                                                    </div>
                                                    <div className="form-group mb-3 col-md-6">
                                                        <label className="text-black font-w500">Password <span className="text-danger">*</span></label>
                                                        <div className="password-input-container">
                                                        <Field name="password" type={showPassword ? "text" : "password"} className="form-control" placeholder="Password" />
                                                        <EyePasswordBtn showPassword={showPassword} setShowPassword={setShowPassword}/>
                                                        </div>
                                                      
                                                        <ErrorMessage name="password" component="div" className="validation-text" />
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="form-group mb-3 col-md-6">
                                                        <label className="text-black font-w500">Contact Name <span className="text-danger">*</span></label>
                                                        <Field name="contact_name" className="form-control" placeholder="Contact Name" />
                                                        <ErrorMessage name="contact_name" component="div" className="validation-text" />
                                                    </div>
                                                    <div className="form-group mb-3 col-md-6">
                                                        <label className="text-black font-w500">Address <span className="text-danger">*</span></label>
                                                        <Field name="address" className="form-control" placeholder="Address" />
                                                        <ErrorMessage name="address" component="div" className="validation-text" />
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="form-group mb-3 col-md-6">
                                                        <label className="text-black font-w500">Country <span className="text-danger">*</span></label>
                                                        <Field as="select" name="country" className="form-control" onChange={(e) => {
                                                            setFieldValue("country", e.target.value);
                                                            handleCountryChange(e);
                                                        }}>
                                                            <option value="" disabled>Choose...</option>
                                                            {countries?.map((country) => (
                                                                <option key={country.id} value={country.id}>{country.name}</option>
                                                            ))}
                                                        </Field>
                                                        <ErrorMessage name="country" component="div" className="validation-text" />
                                                    </div>
                                                    <div className="form-group mb-3 col-md-6">
                                                        <label className="text-black font-w500">State <span className="text-danger">*</span></label>
                                                        <Field as="select" name="state" className="form-control" onChange={(e) => {
                                                            setFieldValue("state", e.target.value);
                                                            handleStateChange(e);
                                                        }}>
                                                            <option value="" disabled>Choose...</option>
                                                            {states?.map((item) => (
                                                                <option key={item?.id} value={item?.id}>{item?.name}</option>
                                                            ))}
                                                        </Field>
                                                        <ErrorMessage name="state" component="div" className="validation-text" />
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="form-group mb-3 col-md-6">
                                                        <label className="text-black font-w500">City <span className="text-danger">*</span></label>
                                                        <Field as="select" name="cities" className="form-control" onChange={(e) => {
                                                            setFieldValue("cities", e.target.value);
                                                            handleCitesChange(e);
                                                        }}>
                                                            <option value="" disabled>Choose...</option>
                                                            {cities?.map((item) => (
                                                                <option key={item?.id} value={item?.id}>{item?.name}</option>
                                                            ))}
                                                        </Field>
                                                        <ErrorMessage name="cities" component="div" className="validation-text" />
                                                    </div>
                                                    <div className="form-group mb-3 col-md-6">
                                                        <label className="text-black font-w500">Pin code <span className="text-danger">*</span></label>
                                                        <Field name="pincode" className="form-control" placeholder="Pincode" />
                                                        <ErrorMessage name="pincode" component="div" className="validation-text" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="submit" className="btn btn-primary">{loading ? 'Adding...' : 'Add'}</button>
                                        <button type="button" onClick={() => setAddCard(false)} className="btn btn-danger"><i className="flaticon-delete-1"></i> Discard</button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </Modal>
           
        </>
    )
}

export default ClientAddModal