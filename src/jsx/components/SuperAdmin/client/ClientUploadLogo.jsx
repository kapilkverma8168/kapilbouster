import React, { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { UploadClientLogo } from '../../../../services/superadminService/ClientService';
import notify from '../../../../utils/notification';
import swal from 'sweetalert';

const ClientUploadLogo = ({ showlogoModal, setShowlogoModal,ClientId }) => {
    const [file, setFile] = useState(null);

    const logoUploadFile = async () => {
        if (!file) {
            notify('error', 'Please select a file before updating.');
            return;
        }

        const formData = new FormData();
        formData.append('client_logo', file);
        formData.append('id', ClientId);
        

        try {
            const response = await UploadClientLogo(formData);
            //console.log("response===>", response);
            if (response?.data?.status === true) {
                swal(`${response?.data?.message}`);
            } else {
                notify('error', response.data.message);
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                notify('error', error.response.data.message);
            } else {
                notify('error', 'An unexpected error occurred. Please try again.');
            }
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };

    const handleSubmit = async () => {
        await logoUploadFile();
        setShowlogoModal(false); // Optionally close the modal after upload
    };
    return (
        <Modal className="fade" show={showlogoModal}>
            <Modal.Header>
                <Modal.Title>Update  Client Logo</Modal.Title>
                <Button
                    variant=""
                    className="btn-close"
                    onClick={() => setShowlogoModal(false)}
                >

                </Button>
            </Modal.Header>
            <Modal.Body>
                <div className="form-group mb-3 col-md-6">
                    <label for="formFile" className="form-label text-black font-w500">Upload Logo <span className="text-danger">*</span></label>
                    <input className="form-control" type="file" id="formFile" onChange={handleFileChange}  />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    onClick={() => setShowlogoModal(false)}
                    variant="danger light"
                >
                    Close
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Update Logo
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ClientUploadLogo