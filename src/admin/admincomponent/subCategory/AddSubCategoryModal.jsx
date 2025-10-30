import { useFormik } from "formik";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import swal from "sweetalert";
import * as Yup from "yup";
import notify from "../../../utils/notification";
import axiosInstance from "../../../services/AxiosInstance";

const AddSubCategoryModal = ({
  showAddModal,
  setShowAddModal,
  CategorySubListApi,
  categoryTypeListData,
}) => {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      categoryName: "",
      slug: "",
      status: "",
      category_name_view: "",
    },
    validationSchema: Yup.object({
      categoryName: Yup.string()
        .trim()
        .matches(
          /^[A-Za-z\s\-_/\\]+$/,
          "Category name can only contain letters, spaces, hyphen, underscore, slash (/), and backslash (\\)"
        )
        .test(
          "no-only-spaces",
          "Category name cannot be only spaces",
          (value) => value && value.trim().length > 0
        )
        .required("Please fill in the category name"),
      status: Yup.string().required("Please fill in the status"),
    }),

    onSubmit: async (values, { setSubmitting, resetForm }) => {

      const newContent = {
        sub_category_name: values.categoryName.trim(),
        category_id: values.parentCategoryId, // Default value
        active_status: values.status,
        user_level_id: 5,
      };

      try {
        setLoading(true);
        const response = await axiosInstance.post("/user-sub-type", newContent);

        if (response?.data?.statusCode === 201) {
          swal("Success", `${response?.data?.message}`, "success");
          CategorySubListApi();
          setShowAddModal(false);
          resetForm();
        } else {
          notify("error", response?.data?.message);
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          "An unexpected error occurred. Please try again.";
        notify("error", errorMessage);
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    },
  });

  return (
    <>
      <Modal
        className="modal fade"
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
      >
        <div className="" role="document">
          <div className="">
            <form onSubmit={formik.handleSubmit}>
              <div className="modal-header">
                <h4 className="modal-title fs-20">Add User Type</h4>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAddModal(false)}
                  data-dismiss="modal"
                >
                  <span></span>
                </button>
              </div>
              <div className="modal-body">
                <i
                  className="flaticon-cancel-12 close"
                  data-dismiss="modal"
                ></i>
                <div className="add-contact-box">
                  <div className="add-contact-content">
                    <div className="row">
                      <div className="form-group mb-3 col-md-6">
                        <label className="text-black font-w500">
                          Enter User Type Name{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <div className="contact-name">
                          <input
                            type="text"
                            className="form-control"
                            name="categoryName"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.categoryName}
                            placeholder="Enter category name"
                          />
                          {formik.touched.categoryName &&
                          formik.errors.categoryName ? (
                            <span className="validation-text text-danger">
                              {formik.errors.categoryName}
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <div className="form-group mb-3 col-md-6">
                        <label className="text-black font-w500">
                          Select Parent User Type{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-control"
                          name="parentCategoryId"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.parentCategoryId}
                        >
                          <option value="">Select Parent User Type</option>
                          {categoryTypeListData?.data?.map((type) => (
                            <option
                              key={type.category_id}
                              value={type.category_id}
                            >
                              {type.category_name_view}
                            </option>
                          ))}
                        </select>
                      </div>
                      </div>
                      <div className="row">
                      <div className="form-group mb-3 col-md-6">
                        <label className="text-black font-w500">
                          Status <span className="text-danger">*</span>
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
                            <span className="validation-text text-danger">
                              {formik.errors.status}
                            </span>
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
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Add"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-danger"
                >
                  <i className="flaticon-delete-1"></i> Discard
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AddSubCategoryModal;
