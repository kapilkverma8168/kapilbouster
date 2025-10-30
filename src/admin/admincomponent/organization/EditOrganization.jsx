import React from 'react'

const EditOrganization = () => {
  return (
    <Modal className="modal fade" show={showEditModal} onHide={setShowEditModal} >
    <div className="" role="document">
        <div className="">
            <form >
                <div className="modal-header">
                    <h4 className="modal-title fs-20">Edit Category</h4>
                    <button type="button" className="btn-close" onClick={() => setShowEditModal(false)} data-dismiss="modal"><span></span></button>
                </div>
                <div className="modal-body">
                    <i className="flaticon-cancel-12 close" data-dismiss="modal"></i>
                    <div className="add-contact-box">
                        <div className="add-contact-content">
                            <div className="row">
                                <div className="form-group mb-3 col-md-6">
                                    <label className="text-black font-w500">Category Name</label>
                                    <div className="contact-name">
                                        <input type="text" className="form-control" autoComplete="off"
                                            name="category" required="required"
                                            value={EditFormData?.category}
                                            onChange={handleEditFormChange}
                                            placeholder="name"
                                        />

                                        {/* <DTInpurTfiled value={EditFormData?.category}
                                            onChange={handleEditFormChange} tit/>

                                            <DTActionDialog onPositiveClick={} onNegativeBtnClick={} /> */}
                                        <span className="validation-text"></span>
                                    </div>
                                </div>
                                <div className="form-group mb-3 col-md-6">
                                    <label className="text-black font-w500">Parent Category</label>
                                    <div className="contact-name">
                                        <select
                                            defaultValue={"option"}
                                            name="category_id"
                                             value={EditFormData?.category_id}
                                            onChange={handleEditFormChange}
                                            id="inputState"
                                            className="form-control"
                                        >
                                            <option>select category Parent</option>
                                            <option value="1">Individual</option>
                                            <option value="2">institute</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group mb-3 col-md-6">
                                    <label className="text-black font-w500">status</label>
                                    <div className="contact-name">
                                        <select
                                            defaultValue={"option"}
                                            name="status"
                                            value={EditFormData?.status}
                                            onChange={handleEditFormChange}
                                            id="inputState"
                                            className="form-control"
                                        >
                                            <option>select status</option>
                                            <option value="1">Active</option>
                                            <option value="2">InActive</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group mb-3 col-md-6">
                                    <label className="text-black font-w500">Slug</label>
                                    <div className="contact-name">
                                        <input type="text" className="form-control" autoComplete="off"
                                            name="Date" required="required"
                                            value={EditFormData?.slug}
                                            onChange={handleEditFormChange}
                                            placeholder="Slug"
                                        />
                                        <span className="validation-text"></span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                {/* <PurpleButton btnTitle="Signin" onBtnClick={handleAddFormSubmit} /> */}
                
                    <button type="submit" className="btn btn-primary" onClick={handleAddFormSubmit}>Add</button>
                    <button type="button" onClick={() => setShowEditModal(false)} className="btn btn-danger"> <i className="flaticon-delete-1"></i> Discard</button>
                </div>
            </form>

        </div>
    </div>
    </Modal>
  )
}

export default EditOrganization