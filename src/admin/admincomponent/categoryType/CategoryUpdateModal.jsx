import React, { useEffect, useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';

import swal from "sweetalert";
import { Modal } from 'react-bootstrap';
import { nanoid } from 'nanoid';
import { updateCategoryType } from '../../../services/superadminService/CategoreyType';
import { DTActionDialog, DTInpurTfiled, PurpleButton } from '../../../common/ui/view/CustomButton';
import * as Yup from 'yup';
import axiosInstance from '../../../services/AxiosInstance';
const CategoryUpdateModal = ({ showEditModal, setShowEditModal, ClientId, categoryidList, CategoryList, userCategory }) => {
    const [initialValues, setInitialValues] = useState({
        category: '',
        category_id: '',
        status: '',
        slug: '',
    });
    console.log(categoryidList.category_id);
    useEffect(() => {
        if (categoryidList) {
            setInitialValues({
                category: categoryidList?.category_name_view || '',
                category_id: categoryidList?.category_id || '',
                status: categoryidList?.active_status == true ? "1" : "0" || '',
                // slug: categoryidList?.slug || '',
            });
        }
    }, [categoryidList]);

    const validationSchema = Yup.object({
        category: Yup.string()
                .trim()
                .matches(
                  /^[A-Za-z\s\-_]+$/,
                  "Category name can only contain letters, spaces, hyphen, and underscore"
                )
                .test(
                  "no-only-spaces",
                  "Category name cannot be only spaces",
                  (value) => value && value.trim().length > 0
                )
                .required("Please fill in the category name"),
        category_id: Yup.string().required('Please select user category main.'),
        status: Yup.string().required('Please select status'),
        // slug: Yup.string().required('Please fill slug'),
    });

    const handleFormSubmit = async (values, { setSubmitting, setErrors }) => {
        console.log(values);
        const editData = {
            category_name: values.category.trim(),
            user_category_main_id: 1,
            active_status: `${values.status}`,
            has_child: "0",
            user_level_id: 5
            // slug: values.slug,
        };

        try {
            const response = await axiosInstance.put(`/user-type/${categoryidList.category_id}`, editData);
            if (response?.data?.statusCode === 200) {
                swal("Success", `${response?.data?.message}`, "success");
                CategoryList();
                setShowEditModal(false);
            } else {
                swal('Oops', response?.data?.message, "error");
            }
        } catch (error) {
            console.log("error", error);
            swal('Oops', 'An unexpected error occurred. Please try again.', "error");
        } finally {
            setSubmitting(false);
        }
    };
console.log(validationSchema);
    return (
        <Modal className="modal fade" show={showEditModal} onHide={() => setShowEditModal(false)}>
            <div role="document">
                <div>
                    <Formik
                        initialValues={initialValues}
                        enableReinitialize
                        validationSchema={validationSchema}
                        onSubmit={handleFormSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form>
                                <div className="modal-header">
                                    <h4 className="modal-title fs-20">Edit Category</h4>
                                    <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}><span></span></button>
                                </div>
                                <div className="modal-body">
                                    <div className="add-contact-box">
                                        <div className="add-contact-content">
                                            <div className="row">
                                                <div className="form-group mb-3 col-md-6">
                                                    <label className="text-black font-w500">Category Name <span className="text-danger">*</span> </label>
                                                    <Field type="text" name="category" className="form-control" placeholder="Category Name" />
                                                    <ErrorMessage name="category" component="div" className="validation-text" />
                                                </div>
                                                <div className="form-group mb-3 col-md-6">
                                                    <label className="text-black font-w500">Parent Category <span className="text-danger">*</span> </label>
                                                    <Field as="select" name="category_id" className="form-control">
                                                        {/* <option value="" disabled>Select category</option>
                                                        {userCategory?.data?.map((item) => (
                                                            <option key={item.id} value={item.id}>{item.main_category_name}</option>
                                                        ))} */}
                                                        <option value={"1"}>Individual</option>
                                                        <option value={"2"}>Institutional</option>
                                                    </Field>
                                                    <ErrorMessage name="category_id" component="div" className="validation-text" />
                                                </div>
                                                <div className="form-group mb-3 col-md-6">
                                                    <label className="text-black font-w500">Status <span className="text-danger">*</span> </label>
                                                    <Field as="select" name="status" className="form-control">
                                                        <option value="" disabled>Select status</option>
                                                        <option value="1">Active</option>
                                                        <option value="0">Inactive</option>
                                                    </Field>
                                                    <ErrorMessage name="status" component="div" className="validation-text" />
                                                </div>
                                                {/* <div className="form-group mb-3 col-md-6">
                                                    <label className="text-black font-w500">Slug</label>
                                                    <Field type="text" name="slug" className="form-control" placeholder="Slug" />
                                                    <ErrorMessage name="slug" component="div" className="validation-text" />
                                                </div> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>Update</button>
                                    <button type="button" onClick={() => setShowEditModal(false)} className="btn btn-danger">Discard</button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </Modal>
    );
};

export default CategoryUpdateModal;
