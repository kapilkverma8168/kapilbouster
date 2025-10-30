import React, { useEffect, useState } from "react";
import swal from "sweetalert";
import { Modal } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import axiosInstance from "../../../services/AxiosInstance";

const EditSubCategoryModal = ({
  showEditModal,
  setShowEditModal,
  ClientId,
  subCategoryIdData,
  categoryTypeListData,
  CategorySubListApi,
}) => {
  const [initialValues, setInitialValues] = useState({
    category: "",
    category_id: "",
    slug: "",
    status: "",
  });

  useEffect(() => {
    if (subCategoryIdData) {
      setInitialValues({
        category: subCategoryIdData?.sub_category_name_view || "",
        category_id: subCategoryIdData?.parent_category_id || "1", // Default value set to 1
        status: subCategoryIdData?.active_status == true ? "1" : "0" || "",
      });
    }
  }, [subCategoryIdData]);

  const validationSchema = Yup.object({
    category: Yup.string()
      .trim()
      .matches(
        /^[A-Za-z\s\-_/\\]+$/,
        "Category name can only contain letters, spaces, hyphen, and underscore"
      )
      .test(
        "no-only-spaces",
        "Category name cannot be only spaces",
        (value) => value && value.trim().length > 0
      )
      .required("Please fill in the category name"),
    status: Yup.string().required("Please select status"),
  });

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const editData = {
        sub_category_name: values.category.trim(),
        category_id: +values.category_id || 1, // Ensure default value is sent
        active_status: `${values.status}`,
        user_level_id: 5,
      };
      console.log(editData);
      try {
        const response = await axiosInstance.put(
          `/user-sub-type/${ClientId}`,
          editData
        );
        if (response?.status === 200) {
          CategorySubListApi();
          setShowEditModal(false);
          swal("Success", `${response?.data?.message}`, "success");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Modal
      className="modal fade"
      show={showEditModal}
      onHide={() => setShowEditModal(false)}
    >
      <div role="document">
        <div className="">
          <form onSubmit={formik.handleSubmit}>
            <div className="modal-header">
              <h4 className="modal-title fs-20">Edit User Type</h4>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowEditModal(false)}
                data-dismiss="modal"
              >
                <span></span>
              </button>
            </div>
            <div className="modal-body">
              <i className="flaticon-cancel-12 close" data-dismiss="modal"></i>
              <div className="add-contact-box">
                <div className="add-contact-content">
                  <div className="row">
                    <div className="form-group mb-3 col-md-6">
                      <label className="text-black font-w500">
                        User Type Name <span className="text-danger">*</span>
                      </label>
                      <div className="contact-name">
                        <input
                          type="text"
                          className="form-control"
                          name="category"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.category}
                          placeholder="name"
                        />
                        {formik.touched.category && formik.errors.category ? (
                          <div className="validation-text">
                            {formik.errors.category}
                          </div>
                        ) : null}
                      </div>
                    </div>
                    {/* <div className="form-group mb-3 col-md-6">
                      <label className="text-black font-w500">
                        Parent Category
                      </label>
                      <div className="contact-name">
                        <select
                          name="category_id"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.category_id}
                          className="form-control"
                        >
                          <option value="1">Default Category</option>
                          {categoryTypeListData?.data?.map((item) => (
                            <option key={item?.id} value={item?.category_id}>
                              {item?.category_name_view}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div> */}

                    <div className="form-group mb-3 col-md-6">
                      <label className="text-black font-w500">
                        Status <span className="text-danger">*</span>{" "}
                      </label>
                      <div className="contact-name">
                        <select
                          name="status"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.status}
                          className="form-control"
                        >
                          <option value="">Select status</option>
                          <option value="1">Active</option>
                          <option value="0">Inactive</option>
                        </select>
                        {formik.touched.status && formik.errors.status ? (
                          <div className="validation-text">
                            {formik.errors.status}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={formik.isSubmitting}
              >
                {formik.isSubmitting ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="btn btn-danger"
              >
                <i className="flaticon-delete-1"></i> Discard
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default EditSubCategoryModal;
