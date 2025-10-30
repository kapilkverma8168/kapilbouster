import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import CommunicateMultiSelect from "./CommunicateMultiSelect";
import {
  getCategories,
  getMainCategories,
  getNotificationValues,
  getSubCategoryType,
  postCommunicateData,
} from "../../../services/adminApiService/communicateApi/communicateApi";
import swal from "sweetalert";
import ImageModal from "../../../components/ImageModal";

let initialCommunicateData = {
  notificationFor: {},
  mainCategory: {},
  CategoryType: {},
  SubCategoryType: [],
  title: "",
  message: "",
  url: "",
};

export function formatString(str) {
  return str?.toLowerCase().split(" ").join("");
}

//payload generator

function payloadGenerator(data) {
  return {
    title: data.title,
    url: data.url,
    message: data.message,
    notification_for_id: data.notificationFor?.notification_for_id?.toString(),
    user_category_main_id: [data.mainCategory?.id?.toString()],
    user_category_types_id: [data.CategoryType?.id?.toString()],
    user_category_sub_types_id: data?.SubCategoryType.map((ele) =>
      ele.id.toString()
    ),
  };
}

// validation regex
// const ALLOWED_CHARACTERS_REGEX = /^[a-zA-Z0-9\s()]*$/;
const ALLOWED_CHARACTERS_REGEX = /^[a-zA-Z0-9\s\()\.\,\-\!\:\&]*$/;

export default function CommunicationModal({ show, handleClose, fetchData }) {
  const [noticationForOptions, setnoticationForOptions] = React.useState([]);
  const [categories, setcategories] = React.useState([]);
  const [CategoryType, setCategoryType] = React.useState([]);
  const [subCategoryType, setsubCategoryType] = React.useState([]);
  const [data, setdata] = React.useState(initialCommunicateData);
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [fileUrl, setFileUrl] = React.useState(null);
  const fileInputRef = React.useRef(null);
  const [Error, setError] = React.useState({
    titleError: "",
    messageError: "",
  });
  const [showImageModal, setShowImageModal] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState("");

  // Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    let payload = payloadGenerator(data);
    if (Object.values(Error).some(Boolean)) {
      swal("Validation failed!", "", "error");
      return;
    }

    if (selectedFile) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(selectedFile);
      fileReader.onload = async () => {
        try {
          const base64File = fileReader.result;
          if (base64File) {
            let formatBase64File = base64File.split(",")[1];
            payload.documents = {
              mime: selectedFile.type,
              data: formatBase64File,
            };
          }
          let res = await postCommunicateData(payload);
          if (res.data.status && res.data.status !== "error") {
            handleClose();
            swal("Notification Created!", "", "success");
            fetchData();
            handleReset();
          } else {
            swal(`${res.data.status}`, "", "error");
          }
        } catch (error) {
          console.log(error);
        }
      };

      fileReader.onerror = (error) => {
        console.error("Error reading file:", error);
      };
    } else {
      let res = await postCommunicateData(payload);
      if (res.data.status && res.data.status !== "error") {
        try {
          handleClose();
          swal("Notification Created!", "", "success");
          fetchData();
          handleReset();
        } catch (error) {
          console.log(error);
        }
      } else {
        swal("Something went wrong!!!", "", "error");
      }
    }
  };

  const handleNotificationFor = async (e) => {
    try {
      const selectedValue = e.target.value;
      setdata({
        ...data,
        notificationFor: noticationForOptions.find(
          (options) =>
            formatString(options.notification_for_name) === selectedValue
        ),
        mainCategory: {},
        CategoryType: {},
        SubCategoryType: [],
      });
      setcategories([]);
      setCategoryType([]);
      setsubCategoryType([]);
      let res = await getMainCategories();
      setcategories(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleMainCategories = async (e) => {
    try {
      const selectedValue = e.target.value;
      setdata({
        ...data,
        mainCategory: categories.find(
          (options) =>
            formatString(options.main_category_name) === selectedValue
        ),
        CategoryType: {},
        SubCategoryType: [],
      });
      setCategoryType([]);
      setsubCategoryType([]);
      let res = await getCategories();
      setCategoryType(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCategories = async (e) => {
    try {
      const selectedValue = e.target.value;
      setdata({
        ...data,
        CategoryType: CategoryType.find(
          (options) => formatString(options.category_name) === selectedValue
        ),
      });
      let selectedCategory = CategoryType.find(
        (ele) =>
          ele?.category_name.toLowerCase().split(" ").join("") ===
          e.target.value
      );
      let res = await getSubCategoryType(selectedCategory);
      setsubCategoryType(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubCategories = (subcategories = []) => {
    const filterCategory = subCategoryType.filter((subCat) =>
      subcategories.some((sub) => sub.label === subCat.sub_category_name)
    );
    setdata({ ...data, SubCategoryType: filterCategory });
  };

  const handleChangeInputValues = (e) => {
    let { name, value } = e.target;
    if (name === "title") {
      if (!ALLOWED_CHARACTERS_REGEX.test(value)) {
        setError({ ...Error, titleError: "You can't use special Character" });
      } else {
        setError({ ...Error, titleError: "" });
      }
    }
    if (name === "message") {
      if (!ALLOWED_CHARACTERS_REGEX.test(value)) {
        setError({ ...Error, messageError: "You can't use special Character" });
      } else {
        setError({ ...Error, messageError: "" });
      }
    }
    setdata({ ...data, [name]: value });
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setFileUrl(URL.createObjectURL(e.target.files[0]));
    } else {
      setSelectedFile(null);
      setFileUrl(null);
    }
  };

  const handleFilePreview = () => {
    if (fileUrl) {
      setSelectedImage(fileUrl);
      setShowImageModal(true);
    }
  };

  const handleReset = () => {
    setdata(initialCommunicateData);
    setcategories([]);
    setCategoryType([]);
    setsubCategoryType([]);
    setSelectedFile(null);
    setFileUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  useEffect(() => {
    async function fetchNoticationValue() {
      try {
        let res = await getNotificationValues();
        setnoticationForOptions(res.data.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchNoticationValue();
  }, []);

  return (
    <Modal show={show} onHide={handleClose}>
      <form onSubmit={handleSubmit}>
        <div className="modal-header">
          <h4 className="modal-title fs-20">Select Options</h4>
          <button type="button" className="btn-close" onClick={handleClose}>
            <span></span>
          </button>
        </div>
        <div className="modal-body">
          <div className="add-contact-box">
            <div className="add-contact-content">
              {/* 1st Row */}
              <div className="row">
                <div
                  className={`form-group mb-3 ${
                    formatString(
                      data?.notificationFor?.notification_for_name
                    ) !== "website"
                      ? "col-md-6"
                      : "col-md-12"
                  }`}
                >
                  <label className="text-black font-w500">
                    Notification For <span className="text-danger">*</span>
                  </label>
                  <div className="contact-name">
                    <select
                      required
                      onChange={handleNotificationFor}
                      defaultValue="option"
                      name="notification_for"
                      id="inputState"
                      className="form-control"
                    >
                      <option value={""}>Notification For</option>
                      {noticationForOptions?.map((ele, index) => {
                        return (
                          <option
                            key={index}
                            value={formatString(ele?.notification_for_name)}
                          >
                            {ele?.notification_for_name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                {formatString(data?.notificationFor?.notification_for_name) !==
                "website" ? (
                  <div className={`form-group mb-3 col-md-6`}>
                    <label className="text-black font-w500">
                      Select Main Category{" "}
                      <span className="text-danger">*</span>
                    </label>
                    <div className="contact-name">
                      <select
                        required={
                          formatString(
                            data?.notificationFor?.notification_for_name
                          ) !== "website"
                            ? true
                            : false
                        }
                        onChange={handleMainCategories}
                        defaultValue="option"
                        name="main_category"
                        id="inputState"
                        className="form-control"
                      >
                        <option value={""}>Select Main Category</option>
                        {data.notificationFor !== ""
                          ? categories?.map((ele, index) => {
                              return (
                                <option
                                  key={index}
                                  value={formatString(ele.main_category_name)}
                                >
                                  {ele.main_category_name}
                                </option>
                              );
                            })
                          : []}
                      </select>
                    </div>
                  </div>
                ) : null}
              </div>
              {/* 2nd Row */}
              {formatString(data?.notificationFor?.notification_for_name) !==
              "website" ? (
                <div className="row">
                  <div className="form-group mb-3 col-md-6">
                    <label className="text-black font-w500">
                      Select Category Type{" "}
                      <span className="text-danger">*</span>
                    </label>
                    <div className="contact-name">
                      <select
                        required={
                          formatString(
                            data?.notificationFor?.notification_for_name
                          ) !== "website"
                            ? true
                            : false
                        }
                        onChange={handleCategories}
                        defaultValue="option"
                        name="category_type"
                        id="inputState"
                        className="form-control"
                      >
                        <option value={""}>Select Category Type</option>
                        {data.mainCategory !== ""
                          ? CategoryType?.map((ele, index) => {
                              return (
                                <option
                                  key={index}
                                  value={formatString(ele?.category_name)}
                                >
                                  {ele.category_name}
                                </option>
                              );
                            })
                          : null}
                      </select>
                    </div>
                  </div>

                  <div className="form-group mb-3 col-md-6">
                    <label className="text-black font-w500">
                      Select Sub Category <span className="text-danger">*</span>
                    </label>
                    <div className="contact-name">
                      <CommunicateMultiSelect
                        handleSubCategories={handleSubCategories}
                        subCategoryType={subCategoryType}
                        data={data}
                      />
                    </div>
                  </div>
                </div>
              ) : null}
              {/* 3rd Row */}
              <div className="row">
                <div className="form-group mb-3 col-md-12">
                  <label className="text-black font-w500">
                    Title <span className="text-danger">*</span>
                  </label>
                  <div className="contact-name">
                    {" "}
                    <Form.Control
                      required
                      value={data.title}
                      name="title"
                      onChange={handleChangeInputValues}
                      placeholder="Enter Title"
                    />
                  </div>
                  <span className="validation-text text-danger">
                    {Error.titleError && Error.titleError}
                  </span>
                </div>
              </div>
              {/* 4th row */}
              <div className="row">
                <div className="form-group mb-3 col-md-12">
                  <label className="text-black font-w500">
                    Message <span className="text-danger">*</span>
                  </label>
                  <div className="contact-name">
                    {" "}
                    <Form.Control
                      required
                      value={data.message}
                      name="message"
                      onChange={handleChangeInputValues}
                      as="textarea"
                      placeholder="Message"
                    />
                  </div>
                  <span className="validation-text text-danger">
                    {Error.messageError && Error.messageError}
                  </span>
                </div>
              </div>
              {/* 5th Row */}
              <div className="row">
                <div className="form-group mb-3 col-md-12">
                  <label className="text-black font-w500">
                    URL
                    {/* <span className="text-danger">*</span> */}
                  </label>
                  <div className="contact-name">
                    {" "}
                    <Form.Control
                      value={data.url}
                      name="url"
                      onChange={handleChangeInputValues}
                      type="url"
                      placeholder="Enter URL"
                    />
                  </div>
                </div>
              </div>
              {/* 6th Row */}
              <div className="row">
                <div className="form-group mb-3 col-md-12">
                  <Form.Group controlId="formFile">
                    <Form.Label className="text-black font-w500">
                      Upload Document
                      {/* <span className="text-danger">*</span> */}
                    </Form.Label>
                    <div className="d-flex align-items-center">
                      <Form.Control
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={handleFileChange}
                      />
                      <Button
                        variant="primary"
                        className="ms-2"
                        disabled={!selectedFile}
                        onClick={handleFilePreview}
                      >
                        Preview
                      </Button>
                    </div>
                  </Form.Group>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer d-flex justify-content-between">
          <div className="d-flex justify-content-end w-100">
            <button
              type="button"
              className="btn btn-secondary mx-2"
              onClick={handleReset}
            >
              Reset
            </button>
            <button type="submit" className="btn btn-primary mx-2">
              Save
            </button>
          </div>
        </div>
      </form>

      {/* Image Modal */}
      <ImageModal
        show={showImageModal}
        onHide={() => setShowImageModal(false)}
        imageUrl={selectedImage}
        imageAlt="Document"
      />
    </Modal>
  );
}
