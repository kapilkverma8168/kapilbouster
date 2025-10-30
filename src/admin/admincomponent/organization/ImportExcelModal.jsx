import React, { useContext, useEffect, useRef, useState } from 'react'
import Form from 'react-bootstrap/Form';

import swal from "sweetalert";
import { Button, Modal } from 'react-bootstrap';
import { nanoid } from 'nanoid';
import { CreateAllClientList, UploadClientLogo } from '../../../services/superadminService/ClientService';
import notify from '../../../utils/notification';
import { EyePasswordBtn } from '../../../common/ui/view/CustomEyePasswordBtn';
import { FileUploadService } from '../../../config/apiServices';

import { LocationContext } from '../../../context/LocationContext';
import { getAllUserCategory } from '../../../services/superadminService/UserLevel';
import { createSubCategory } from '../../../services/superadminService/SubCategory';
import { getAdminAllSubCategory } from '../../../services/adminApiService/adminSubCategory/AdminSubCategory';
import { UploadAdminExcel } from '../../../services/adminApiService/organisationApi/OrganisationApiService';
import { validateForm, validateSubCategorySelection } from './Validation';
import * as XLSX from 'xlsx';
import Condition from 'yup/lib/Condition';
import "./style.css";

const ImportExcelModal = ({ showImportModal, setShowImportModal, adminCategoryTypeData, getOrganisationListApi, currentPage, perPage }) => {
    const [file, setFile] = useState(null);
    const [errors, setErrors] = useState([]);
    const fileInputRef = useRef(null);
    const [excelErrors, setExcelErrors] = useState([]);

    const [addFormData, setAddFormData] = useState({
        user_category_main: '',
        category_type: '',
        sub_category_type: '',
        excelFile: '',
    });



    const [showLoader, setShowLoader] = useState(false);
    console.log("showLoader", showLoader)
    const [subCategorylistData, setSubCategorylistData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [downLoadbtndisplay, setDownLoadbtndisplay] = useState(false);

    const handleAddFormChange = async (event) => {
        const { name, value } = event.target;

        setAddFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: '',
        }));
        if (name === "user_category_main") {
            setDownLoadbtndisplay(true);
        }

        if (name === "category_type") {
            await getAdminSubCategoryListApi(value);
        }
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = '/SampleSheet.xlsx';
        link.download = 'SampleSheet.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const validateExcelData = (data) => {
        const errors = [];
        data.forEach((row, index) => {
            const nameOfLegalEntity = String(row['Name of Legal Entity'] || '').trim();
            const registrationNumber = String(row['Registration Number'] || '').trim();
            const nameOfInstitution = String(row['Name of Institution'] || '').trim();
            const AddressFullPostalAddress = String(row['Address (Full Postal Address)'] || '').trim();
            const institutionEmail = String(row['Institution Email'] || '').trim();
            const institutionContactNumber = String(row['Institution Contact Number'] || '').trim();
            const ContactPersonName = String(row['Contact Person Name'] || '').trim();
            const ContactPersonDesignation = String(row['Contact Person Designation'] || '').trim();
            const contactPersonEmail = String(row['Contact Person Email'] || '').trim();
            const contactPersonContactNumber = String(row['Contact Person Contact Number'] || '').trim();
            const AffiliatedSportsBody = String(row['Affiliated Sports Body'] || '').trim();
            const AffiliationNumber = String(row['Affiliation Number'] || '').trim();
            const Accreditation = String(row['Accreditation Status (1-Accredited, 2-Not Accredited, 3-In Process)'] || '').trim();

            if (nameOfLegalEntity === '') {
                errors.push(`Row ${index + 1}: Name of Legal Entity must not be empty.`);
            } else if (/[^a-zA-Z0-9 ]/.test(nameOfLegalEntity)) {
                errors.push(`Row ${index + 1}: Name of Legal Entity must not contain special characters.`);
            }

            if (registrationNumber === '') {
                errors.push(`Row ${index + 1}: Registration Number must not be empty.`);
            } else if (/[^a-zA-Z0-9\-#&\[\]]/.test(registrationNumber)) {
                errors.push(`Row ${index + 1}: Registration Number must not contain special characters.`);
            }

            if (nameOfInstitution === '') {
                errors.push(`Row ${index + 1}: Name of Institution must not be empty.`);
            } else if (/[^a-zA-Z0-9 ]/.test(nameOfInstitution)) {
                errors.push(`Row ${index + 1}: Name of Institution must not contain special characters.`);
            }
            if (AddressFullPostalAddress === '') {
                errors.push(`Row ${index + 1}: Name of Address Full Postal Address must not be empty.`);
            } else if (/[^a-zA-Z0-9.,\-#\[\]& \n]/.test(AddressFullPostalAddress)) {
                errors.push(`Row ${index + 1}: Name of Address Full Postal Address must not contain special characters.`);
            }

            if (institutionEmail === '') {
                errors.push(`Row ${index + 1}: Name of Institution Email must not be empty.`);
            } else if (!/\S+@\S+\.\S+/.test(institutionEmail)) {
                errors.push(`Row ${index + 1}: Institution Email is invalid.`);
            }

            if (institutionContactNumber === '') {
                errors.push(`Row ${index + 1}: Name of Institution Contact Number must not be empty.`);
            } else if (!/^\d{10}$/.test(institutionContactNumber)) {
                errors.push(`Row ${index + 1}: Name of Institution Contact Number must be a 10-digit number.`);
            }

            if (ContactPersonName === '') {
                errors.push(`Row ${index + 1}: Name of Contact Person Name must not be empty.`);
            } else if (/[^a-zA-Z0-9 ]/.test(ContactPersonName)) {
                errors.push(`Row ${index + 1}: Name of Contact Person Name must not contain special characters.`);
            }

            if (ContactPersonDesignation === '') {
                errors.push(`Row ${index + 1}: Name of Contact Person Designation must not be empty.`);
            } else if (/[^a-zA-Z0-9 ]/.test(ContactPersonDesignation)) {
                errors.push(`Row ${index + 1}: Name of Contact Person Designation must not contain special characters.`);
            }

            if (contactPersonEmail === '') {
                errors.push(`Row ${index + 1}: Name of Contact Person Email must not be empty.`);
            } else if (!/\S+@\S+\.\S+/.test(contactPersonEmail)) {
                errors.push(`Row ${index + 1}: Contact Person Email is invalid.`);
            }

            if (contactPersonContactNumber === '') {
                errors.push(`Row ${index + 1}: Name of Contact Person Contact Number must not be empty.`);
            } else if (!/^\d{10}$/.test(contactPersonContactNumber)) {
                errors.push(`Row ${index + 1}: Contact Person Contact Number must be a 10-digit number.`);
            }

            if (AffiliatedSportsBody === '') {
                errors.push(`Row ${index + 1}: Name of Affiliated Sports Body must not be empty.`);
            } else if (/[^a-zA-Z0-9 ]/.test(AffiliatedSportsBody)) {
                errors.push(`Row ${index + 1}: Name of Affiliated Sports Body must not contain special characters.`);
            }


            if (AffiliationNumber === '') {
                errors.push(`Row ${index + 1}: Name of Affiliation Number  must not be empty.`);
            } else if (/[^a-zA-Z0-9\-#&\[\]]/.test(AffiliationNumber)) {
                errors.push(`Row ${index + 1}: Name of Affiliation Number must not contain special characters.`);
            }

          


            if (Accreditation === '') {
                errors.push(`Row ${index + 1}: Name of Accreditation Status  must not be empty.`);
            } else if (!['1', '2', '3'].includes(Accreditation)) {
                errors.push(`Row ${index + 1}: Accreditation Status must be one of the following values: 1, 2, or 3.`);
            }

            
    

            // if (!/^\d+$/.test(row['Institution Contact Number'])) {
            //     errors.push(`Row ${index + 1}: Institution Contact Number must be numeric.`);
            // }
            // if (!/\S+@\S+\.\S+/.test(row['Institution Email'])) {
            //     errors.push(`Row ${index + 1}: Institution Email is invalid.`);
            // }
            // if (!/^\d+$/.test(row['Contact Person Contact Number'])) {
            //     errors.push(`Row ${index + 1}: Contact Person Contact Number must be numeric.`);
            // }
            // if (!/\S+@\S+\.\S+/.test(row['Contact Person Email'])) {
            //     errors.push(`Row ${index + 1}: Contact Person Email is invalid.`);
            // }
        });
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { user_category_main, category_type, sub_category_type } = addFormData;
        let formIsValid = true;
        const newErrors = {};

        if (!user_category_main) {
            newErrors.user_category_main = 'User Main Category is required.';
            formIsValid = false;
        }
        if (!category_type) {
            newErrors.category_type = 'Category Type is required.';
            formIsValid = false;
        }
        if (!sub_category_type) {
            newErrors.sub_category_type = 'Sub Category is required.';
            formIsValid = false;
        }
        if (!file) {
            newErrors.file = 'Please select an Excel file to upload.';
            formIsValid = false;
        }

        setErrors(newErrors);

        // if (excelErrors.length > 0) {
        //     formIsValid = false;
        // }



        if (!formIsValid) {
            setLoading(false);
            return;
        }
        setShowLoader(true);
        readXlFile();
    };


    const uplodData = async () => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('user_category_main', addFormData.user_category_main);
        formData.append('category_type', addFormData.category_type);
        formData.append('sub_category_type', addFormData.sub_category_type);
        try {
            const response = await UploadAdminExcel(formData);

            if (response?.status === 200) {

                if (response.data.failedRows && response.data.failedRows.length > 0) {
                    setErrors(response.data.failedRows.map(error => `Row ${error.row_number}: ${error.errors.join(', ')}`));
                    setShowImportModal(false);

                    const errorHTML = `
                     <h4 className="inster_row"> ${response?.data?.insertedRows} Number of Rows Successfully Inserted Into Database</h4>
                        <div class="alert alert-danger">
                        
                            <h5>However, the following rows had issues:</h5>
                           
                            ${response?.data?.failedRows?.map((error, index) => `
                                <div key=${index}>
                                    <strong>Row ${error?.row_number}:</strong>
                                    <ul>
                                        ${error?.errors?.map((err, idx) => `<li key=${idx}>${err}</li>`).join('')}
                                    </ul>
                                </div>
                            `).join('')}
                        </div>
                    `;

                    swal({
                        title: 'Upload Excel was successful!',
                        content: {
                            element: 'div',
                            attributes: {
                                innerHTML: errorHTML,
                            },
                        },
                        icon: 'success',
                    });
                } else {
                    setErrors([]);
                    swal('Success', 'Upload Excel was successful!', 'success');
                }
                getOrganisationListApi(perPage, currentPage); // Call the listing API to update the page
                setShowImportModal(false);
            } else {
                notify('error', response.data.message);
                setErrors([]);
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                notify('error', error.response.data.message);
            } else {
                notify('error', 'An unexpected error occurred. Please try again.');
            }
            setErrors([]);
        } finally {
            setLoading(false);
            setShowLoader(false);
        }
    }

    const handleFileChange = (e) => {
        console.log("handleFileChange===> e", e);
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        const validFileTypes = [
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ];
        if (!validFileTypes.includes(selectedFile.type)) {
            setErrors((prevErrors) => ({ ...prevErrors, file: 'Please upload a valid Excel file.' }));
            setFile(null);
            setExcelErrors([]); // Clear excelErrors when file type is invalid
            return;
        }

        setFile(selectedFile);

    };

    const readXlFile = () => {
        const reader = new FileReader();
        console.log("readExcel===>", file)
        reader.onload = (event) => {
            console.log("handleFileChange===> onLoad", event);
            const binaryStr = event.target.result;
            const workbook = XLSX.read(binaryStr, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(sheet);
            const validationErrors = validateExcelData(data);
            if (validationErrors.length > 0) {
                setExcelErrors(validationErrors);
                // setErrors((prevErrors) => ({ ...prevErrors, file: validationErrors.join(', ') }));
                setErrors([]);
            } else {
                setExcelErrors([]);
                setErrors((prevErrors) => ({ ...prevErrors, file: '' }));
                uplodData();
            }
            fileInputRef.current.value = '';
        };
        reader.readAsBinaryString(file);
        fileInputRef.current.value = '';

    }


    const DiscardHandler = () => {
        setShowImportModal(false);
        setDownLoadbtndisplay(false);
        setErrors([]);
        setExcelErrors([]);
    }

    const getAdminSubCategoryListApi = async (categoryTypeId) => {
        try {
            const response = await getAdminAllSubCategory(categoryTypeId);
            setSubCategorylistData(response?.data);
        } catch (error) {
            console.error('Login error:', error);
        }
    }

    useEffect(() => {
        if (showImportModal) {
            setErrors([]); // Reset errors when the modal is opened
            setExcelErrors([]); // Reset Excel errors when the modal is opened
        }
        getAdminSubCategoryListApi();
    }, [showImportModal]);

    return (
        <>
            <Modal className="modal fade" show={showImportModal} onHide={setShowImportModal}>
                <div className="" role="document">
                    <div className="">
                        <form>
                            <div className="modal-header">
                                <h4 className="modal-title fs-20">Import Excel</h4>
                                <button type="button" className="btn-close" onClick={DiscardHandler} data-dismiss="modal"><span></span></button>
                            </div>
                            <div className="modal-body">
                                <i className="flaticon-cancel-12 close" data-dismiss="modal"></i>
                                <div className="add-contact-box">
                                    <div className="add-contact-content">
                                        <div className="row">
                                            <div className="form-group mb-3 col-md-6">
                                                <label className="text-black font-w500">User Main Category <span className="text-danger">*</span></label>
                                                <div className="contact-name">
                                                    <select
                                                        defaultValue={"option"}
                                                        name="user_category_main"
                                                        onChange={handleAddFormChange}
                                                        id="inputState"
                                                        className="form-control"
                                                    >
                                                        <option>Select Category Type</option>
                                                        <option value="2">Institution </option>
                                                    </select>
                                                    {errors.user_category_main && <span className="validation-text text-danger">{errors.user_category_main}</span>}
                                                </div>
                                            </div>
                                            <div className="form-group mb-3 col-md-6">
                                                <label className="text-black font-w500">Select Category Type <span className="text-danger">*</span></label>
                                                <div className="contact-name">
                                                    <select
                                                        defaultValue={"option"}
                                                        name="category_type"
                                                        onChange={handleAddFormChange}
                                                        id="inputState"
                                                        className="form-control"
                                                    >
                                                        <option>Select Category Type</option>
                                                        {adminCategoryTypeData?.data?.map((item) => (
                                                            <option key={item?.id} value={item?.id}>{item?.category_name}</option>
                                                        ))}
                                                    </select>
                                                    {errors.category_type && <span className="validation-text text-danger">{errors.category_type}</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="form-group mb-3 col-md-6">
                                                <label className="text-black font-w500">Select Sub Category<span className="text-danger">*</span></label>
                                                <div className="contact-name">
                                                    <select
                                                        defaultValue={"option"}
                                                        name="sub_category_type"
                                                        onChange={handleAddFormChange}
                                                        id="inputState"
                                                        className="form-control"
                                                    >
                                                        <option>Select Sub Category</option>
                                                        {subCategorylistData?.map((item) => (
                                                            <option key={item?.id} value={item?.id}>{item?.category_name_view}</option>
                                                        ))}
                                                    </select>
                                                    {errors.sub_category_type && <span className="validation-text text-danger">{errors.sub_category_type}</span>}
                                                </div>
                                            </div>
                                            <div className="form-group mb-3 col-md-6">
                                                <label htmlFor="formFile" className="form-label text-black font-w500">Upload Excel <span className="text-danger">*</span></label>
                                                <input className="form-control" type="file" name="excelFile" id="formFile" onChange={handleFileChange} ref={fileInputRef} />
                                                {errors.file && <span className="validation-text text-danger">{errors.file}</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer d-flex justify-content-between">
                                {downLoadbtndisplay && (
                                    <div>
                                        <Button variant="primary" className="mx-2" onClick={handleDownload}>
                                            Download Excel
                                        </Button>
                                    </div>
                                )}
                                <div>
                                    <button type="submit" className="btn btn-primary mx-2" onClick={handleSubmit}>
                                        Submit
                                        {/* {loading ? 'loading...' : 'Submit'} */}
                                    </button>
                                    <button type="button" onClick={DiscardHandler} className="btn btn-danger"> <i className="flaticon-delete-1"></i> Discard</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                {excelErrors.length > 0 && (
                    <div className="alert alert-danger">
                        <h5>Validation Errors:</h5>
                        <ul>
                            {excelErrors.map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {showLoader && (
                    <div className="loader-overlay">
                        <div className="loader"></div>
                    </div>
                )}
            </Modal>
        </>
    );
}

export default ImportExcelModal;