import React, { useState } from "react";
import swal from "sweetalert";
import { Modal } from "react-bootstrap";
import notify from "../../../utils/notification";
import { useFormik } from "formik";
import * as Yup from "yup";
import axiosInstance from "../../../services/AxiosInstance";

const AddCategoryModal = ({ addCard, setAddCard, CategoryList, userCategory }) => {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      categoryName: "",
      categoryid: "1",
      slug: "",
      status: "",
    },
    validationSchema: Yup.object({
      categoryName: Yup.string()
        .trim()
        .matches(
          /^[A-Za-z0-9\s\-_&()/|@#$%*+={}[\]\\:";'<>.,!?~`^]+$/,
          "Category name can contain letters, numbers, spaces, and special characters"
        )
        .max(100, "Category name must be at most 100 characters")
        .test(
          "no-only-spaces",
          "Category name cannot be only spaces",
          (value) => value && value.trim().length > 0
        )
        .required("Please fill in the category name"),

      categoryid: Yup.string()
        .notOneOf([""], "Please select a main category")
        .required("Please select a main category"),
      status: Yup.string().required("Please fill in the status"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      const newContent = {
        user_category_main_id: values.categoryid,
        category_name: values.categoryName.trim(),
        active_status: values.status,
        has_child: "0",
        user_level_id: 5,
      };

      try {
        setLoading(true);
        const response = await axiosInstance.post("/user-type", newContent);

        if (response?.data?.statusCode === 201) {
          swal("Success", `${response?.data?.message}`, "success");
          setAddCard(false);
          CategoryList();
        } else {
          notify("error", response.data.message);
        }
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          notify("error", error.response.data.message);
        } else {
          notify("error", "An unexpected error occurred. Please try again.");
        }
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    },
  });

  return (
    <>
      <Modal className="modal fade" show={addCard} onHide={() => setAddCard(false)}>
        <div className="" role="document">
          <div className="">
            <form onSubmit={formik.handleSubmit}>
              <div className="modal-header">
                <h4 className="modal-title fs-20">Add Category</h4>
                <button type="button" className="btn-close" onClick={() => setAddCard(false)} data-dismiss="modal">
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
                          Select Main Category
                          <span className="text-danger">*</span>
                        </label>
                        <div className="contact-name">
                          <select
                            name="categoryid"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.categoryid}
                            className="form-control"
                          >
                            <option value="1">Individual</option>
                            {/* <option value="2">Institutional</option> */}
                          </select>
                          {formik.touched.categoryid && formik.errors.categoryid ? (
                            <span className="validation-text text-danger">
                              {formik.errors.categoryid}
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <div className="form-group mb-3 col-md-6">
                        <label className="text-black font-w500">
                          Enter Category Name
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
                            maxLength={100}
                          />
                          {formik.touched.categoryName && formik.errors.categoryName ? (
                            <span className="validation-text text-danger">
                              {formik.errors.categoryName}
                            </span>
                          ) : null}
                        </div>
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
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "Adding..." : "Add"}
                </button>
                <button type="button" onClick={() => setAddCard(false)} className="btn btn-danger">
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

export default AddCategoryModal;
