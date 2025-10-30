import React, { useContext, useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import swal from "sweetalert";
import { Modal } from 'react-bootstrap';
import { EditClient } from '../../../../services/superadminService/ClientService';
import notify from '../../../../utils/notification';
import { clientValidationEditSchema } from './ValidationSchemas';
import { LocationContext } from '../../../../context/LocationContext';
import * as Yup from 'yup';
const ClientEditModal = ({ showEditModal, setShowEditModal, ClientId, clientViewList, ClientListApi }) => {
    const { countries, states, cities, fetchStates, fetchCities } = useContext(LocationContext);

    const [initialValues, setInitialValues] = useState({
        name: '',
        email: '',
        mobile: '',
        contact_name: '',
        address: '',
        city: '',
        state: '',
        country: '',
        pincode: '',
    });

    const handleCountryChange = (e, setFieldValue) => {
        const countryId = e.target.value;
        setFieldValue('country', countryId);
        fetchStates(countryId);
    };

    const handleStateChange = (e, setFieldValue) => {
        const stateId = e.target.value;
        setFieldValue('state', stateId);
        fetchCities(stateId);
    };

    const handleCitiesChange = (e, setFieldValue) => {
        const cityId = e.target.value;
        setFieldValue('city', cityId);
    };

    useEffect(() => {
        if (clientViewList) {
            setInitialValues({
                name: clientViewList.name || '',
                email: clientViewList.email || '',
                mobile: clientViewList.mobile || '',
                contact_name: clientViewList.contact_name || '',
                address: clientViewList.address || '',
                city: clientViewList.city || '',
                state: clientViewList.state || '',
                country: clientViewList.country || '',
                pincode: clientViewList.pincode || '',
            });
        }
    }, [clientViewList]);

    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        mobile: Yup.string().required('Mobile is required'),
        contact_name: Yup.string().required('Contact Name is required'),
        address: Yup.string().required('Address is required'),
        country: Yup.string().required('Country is required'),
        state: Yup.string().required('State is required'),
        city: Yup.string().required('City is required'),
        pincode: Yup.string().required('Pincode is required'),
    });

    const handleFormSubmit = async (values, { setSubmitting, setErrors }) => {
        const editData = {
            name: values.name,
            email: values.email,
            mobile: values.mobile,
            contact_name: values.contact_name,
            city: values.city,
            state: values.state,
            country: values.country,
            pincode: values.pincode,
        };
        try {
            const response = await EditClient(editData, ClientId);
            if (response?.data?.status === true) {
                swal(`${response?.data?.message}`);
                ClientListApi();
                setShowEditModal(false);
            } else {
                if (response.data.message) {
                    setErrors(response.data.message);
                } else {
                    notify('error', response.data.message);
                }
            }
        } catch (error) {
            console.log("error", error);
            swal('Oops', 'An unexpected error occurred. Please try again.', "error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal className="modal fade" show={showEditModal} onHide={() => setShowEditModal(false)}>
            <div role="document">
                <div >
                    <Formik
                        initialValues={initialValues}
                        enableReinitialize
                        validationSchema={validationSchema}
                        onSubmit={handleFormSubmit}
                    >
                        {({ isSubmitting, setFieldValue }) => (
                            <Form>
                                <div className="modal-header">
                                    <h4 className="modal-title fs-20">Edit Client</h4>
                                    <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="add-contact-box">
                                        <div className="add-contact-content">
                                            <div className="row">
                                                <div className="form-group mb-3 col-md-6">
                                                    <label className="text-black font-w500">Name</label>
                                                    <Field name="name" className="form-control" placeholder="Name" />
                                                    <ErrorMessage name="name" component="div" className="validation-text" />
                                                </div>
                                                <div className="form-group mb-3 col-md-6">
                                                    <label className="text-black font-w500">Email</label>
                                                    <Field name="email" className="form-control" placeholder="Email" />
                                                    <ErrorMessage name="email" component="div" className="validation-text" />
                                                </div>
                                                <div className="form-group mb-3 col-md-6">
                                                    <label className="text-black font-w500">Address</label>
                                                    <Field name="address" className="form-control" placeholder="Address" />
                                                    <ErrorMessage name="address" component="div" className="validation-text" />
                                                </div>
                                                <div className="form-group mb-3 col-md-6">
                                                    <label className="text-black font-w500">Mobile</label>
                                                    <Field name="mobile" className="form-control" placeholder="Mobile" />
                                                    <ErrorMessage name="mobile" component="div" className="validation-text" />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="form-group mb-3 col-md-6">
                                                    <label className="text-black font-w500">Contact Name</label>
                                                    <Field name="contact_name" className="form-control" placeholder="Contact Name" />
                                                    <ErrorMessage name="contact_name" component="div" className="validation-text" />
                                                </div>
                                                <div className="form-group mb-3 col-md-6">
                                                    <label className="text-black font-w500">Country</label>
                                                    <Field
                                                        as="select"
                                                        name="country"
                                                        className="form-control"
                                                        onChange={(e) => {
                                                            handleCountryChange(e, setFieldValue);
                                                        }}
                                                    >
                                                        <option value="" disabled>Choose...</option>
                                                        {countries?.map((country) => (
                                                            <option key={country.id} value={country.id}>{country.name}</option>
                                                        ))}
                                                    </Field>
                                                    <ErrorMessage name="country" component="div" className="validation-text" />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="form-group mb-3 col-md-6">
                                                    <label className="text-black font-w500">State</label>
                                                    <Field
                                                        as="select"
                                                        name="state"
                                                        className="form-control"
                                                        onChange={(e) => {
                                                            handleStateChange(e, setFieldValue);
                                                        }}
                                                    >
                                                        <option value="" disabled>Choose...</option>
                                                        {states?.map((item) => (
                                                            <option key={item?.id} value={item?.id}>{item?.name}</option>
                                                        ))}
                                                    </Field>
                                                    <ErrorMessage name="state" component="div" className="validation-text" />
                                                </div>
                                                <div className="form-group mb-3 col-md-6">
                                                    <label className="text-black font-w500">City</label>
                                                    <Field
                                                        as="select"
                                                        name="city"
                                                        className="form-control"
                                                        onChange={(e) => {
                                                            handleCitiesChange(e, setFieldValue);
                                                        }}
                                                    >
                                                        <option value="" disabled>Choose...</option>
                                                        {cities?.map((item) => (
                                                            <option key={item?.id} value={item?.id}>{item?.name}</option>
                                                        ))}
                                                    </Field>
                                                    <ErrorMessage name="city" component="div" className="validation-text" />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="form-group mb-3 col-md-6">
                                                    <label className="text-black font-w500">Pincode</label>
                                                    <Field name="pincode" className="form-control" placeholder="Pincode" />
                                                    <ErrorMessage name="pincode" component="div" className="validation-text" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>Update</button>
                                    <button type="button" className="btn btn-danger" onClick={() => setShowEditModal(false)}>Cancel</button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </Modal>
    );
};

export default ClientEditModal;
