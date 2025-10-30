import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import PageTitle from "../../../jsx/layouts/PageTitle";
import { Link } from "react-router-dom";
import {
  getCategories,
  getCommunicationData,
  getMainCategories,
  getNotificationValues,
  getSubCategoryType,
  updateUserNotificationStatus,
} from "../../../services/adminApiService/communicateApi/communicateApi";
import { Nav, Pagination } from "react-bootstrap";
import Communication from "./Communication";
import { formatString } from "./CommunicationModal";
import CommunicateMultiSelect from "./CommunicateMultiSelect";
import PreviewCommunication from "./PreviewCommunicationModal";
import swal from "sweetalert";
import ImageModal from "../../../components/ImageModal";

let initialCommunicateData = {
  notificationFor: {},
  mainCategory: {},
  CategoryType: {},
  SubCategoryType: [],
};

const CardHeader = ({ handleFilterData, fetchData }) => {
  const [data, setData] = React.useState(initialCommunicateData);
  const [notificationForOptions, setNotificationForOptions] = React.useState(
    []
  );
  const [CategoryType, setCategoryType] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [subCategoryType, setSubCategoryType] = React.useState([]);
  // Handle the notification select box
  const handleNotificationFor = async (e) => {
    try {
      const selectedValue = e.target.value;
      const selectedOption =
        notificationForOptions.find(
          (options) =>
            formatString(options.notification_for_name) === selectedValue
        ) ?? {};

      setData({
        ...data,
        notificationFor: selectedOption,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Handle main category
  const handleMainCategories = async (e) => {
    try {
      const selectedValue = e.target.value;
      const selectedCategory =
        categories.find(
          (options) =>
            formatString(options.main_category_name) === selectedValue
        ) ?? {};

      setData({
        ...data,
        mainCategory: selectedCategory,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Handle category type
  const handleCategories = async (e) => {
    try {
      const selectedValue = e.target.value;
      const selectedType =
        CategoryType.find(
          (options) => formatString(options.category_name) === selectedValue
        ) ?? {};

      setData({
        ...data,
        CategoryType: selectedType,
      });

      let res = await getSubCategoryType(selectedType);
      setSubCategoryType(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Handle sub categories
  const handleSubCategories = (subcategories = []) => {
    const filterCategory = subCategoryType.filter((subCat) =>
      subcategories.some((sub) => sub.label === subCat.sub_category_name)
    );
    setData({ ...data, SubCategoryType: filterCategory });
  };

  // Handle submit filter
  const handleSubmitFilter = async (e) => {
    e.preventDefault();
    handleFilterData(data);
  };

  // Handle reset filter
  const handleResetFilter = (e) => {
    e.preventDefault();
    setData(initialCommunicateData);
    setSubCategoryType([]);
    fetchData();
  };

  async function fetchFilterValues() {
    try {
      let res = await getNotificationValues();
      setNotificationForOptions(() => {
        return res.data.data.filter(
          (item) => item.notification_for_name !== "Website"
        );
      });
    } catch (error) {
      console.log(error);
    }
    let mainCategoryRes = await getMainCategories();
    setCategories(mainCategoryRes.data.data);

    let categoryres = await getCategories();
    setCategoryType(categoryres.data.data);
  }

  // Initial data fetch
  React.useEffect(() => {
    fetchFilterValues();
  }, []);

  return (
    <form onSubmit={handleSubmitFilter}>
      <div className="card-header d-flex flex-row align-items-center flex-wrap">
        {/* Notification For */}
        <div className="flex-grow-1 ms-2 mb-2">
          <div className="input-group">
            <select
              value={
                formatString(data.notificationFor?.notification_for_name) || ""
              }
              onChange={handleNotificationFor}
              name="notification_for"
              id="inputState"
              className="form-control"
            >
              <option value="">Notification For</option>
              {notificationForOptions.map((ele, index) => (
                <option
                  key={index}
                  value={formatString(ele.notification_for_name)}
                >
                  {ele.notification_for_name}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Main Category */}
        <div className="flex-grow-1 ms-2 mb-2">
          <div className="input-group">
            <select
              value={formatString(data.mainCategory?.main_category_name) || ""}
              onChange={handleMainCategories}
              name="main_category"
              id="inputState"
              className="form-control"
            >
              <option value="">Select Main Category</option>
              {categories.map((ele, index) => (
                <option
                  key={index}
                  value={formatString(ele.main_category_name)}
                >
                  {ele.main_category_name}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Category Type */}
        <div className="flex-grow-1 ms-2 mb-2">
          <div className="input-group">
            <select
              value={formatString(data.CategoryType?.category_name) || ""}
              onChange={handleCategories}
              name="category_type"
              id="inputState"
              className="form-control"
            >
              <option value="">Select Category Type</option>
              {CategoryType.map((ele, index) => (
                <option key={index} value={formatString(ele.category_name)}>
                  {ele.category_name}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Sub Categories */}
        <div className="flex-grow-1 ms-2 mb-2">
          <CommunicateMultiSelect
            handleSubCategories={handleSubCategories}
            subCategoryType={subCategoryType}
            data={data}
            requiredValue={false}
          />
        </div>
        {/* Buttons */}
        <div className="ms-2 mb-2 d-flex">
          <Button type="submit" variant="primary mx-2">
            <i className="bi bi-search"></i>
          </Button>
          <Button onClick={handleResetFilter} variant="danger">
            <i className="bi bi-x-circle"></i>
          </Button>
        </div>
      </div>
    </form>
  );
};

function CommunicationList() {
  const [data, setData] = React.useState([]);
  const [limit, setLimit] = React.useState(50);
  const [totalPages, setTotalPages] = React.useState(0);
  const [activePage, setActivePage] = React.useState(1);
  const [paginationStart, setPaginationStart] = React.useState(1);
  const [previewDocId, previewDetdocId] = React.useState(null);
  const [notificationFor, setnotificationFor] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  // Recalculate totalPages whenever data or limit changes
  React.useEffect(() => {
    setTotalPages(Math.ceil(data.length / limit));
  }, [data, limit]);

  const paginatedData = data
    .slice((activePage - 1) * limit, activePage * limit)
    .reverse();

  React.useEffect(() => {
    if (activePage < paginationStart) {
      setPaginationStart(Math.max(activePage - 4, 1));
    } else if (activePage >= paginationStart + 5) {
      setPaginationStart(activePage - 4);
    }
  }, [activePage]);

  // Pagination items
  let items = [];
  for (let number = 1; number <= Math.min(10, totalPages); number++) {
    items.push(
      <Pagination.Item
        key={number}
        active={number === activePage}
        onClick={() => setActivePage(number)}
      >
        {number}
      </Pagination.Item>
    );
  }

  const pag = (size, gutter, variant, bg, circle) => (
    <Pagination
      size={size}
      className={`mt-4 ${gutter ? "pagination-gutter" : ""} ${
        variant && `pagination-${variant}`
      } ${!bg && "no-bg"} ${circle && "pagination-circle"}`}
    >
      <li className="page-item page-indicator">
        <Link
          className="page-link"
          to="#"
          onClick={() => setActivePage(Math.max(activePage - 1, 1))}
        >
          <i className="la la-angle-left" />
        </Link>
      </li>
      {items}
      <li className="page-item page-indicator">
        <Link
          className="page-link"
          to="#"
          onClick={() => setActivePage(Math.min(activePage + 1, totalPages))}
        >
          <i className="la la-angle-right" />
        </Link>
      </li>
    </Pagination>
  );

  // fetchData
  async function fetchData() {
    try {
      let res = await getCommunicationData();
      let data = res?.data?.data?.data.map((ele) => ele);
      setData(data);
    } catch (error) {
      console.log(error.message);
    }
  }
  // Initial data fetch
  React.useEffect(() => {
    // Communicate Data for Listing
    fetchData();
  }, []);

  // handle filter data

  const handleFilterData = async (data) => {
    const formData = new FormData();
    formData.append(
      "notification_for_id",
      data.notificationFor?.notification_for_id ?? ""
    );
    formData.append("main_category_wise", data.mainCategory?.id ?? "");
    formData.append("category_wise", data.CategoryType?.id ?? "");
    data.SubCategoryType?.forEach((item) => {
      formData.append("sub_category_wise[]", item.id?.toString());
    });
    let res = await getCommunicationData(formData);
    setData(res.data.data.data);
  };

  const handleStatus = async (e, id) => {
    let res = await updateUserNotificationStatus(id, Number(e.target.checked));
    if (res?.data?.status) {
      swal(res?.data?.message, "", "success");
      fetchData();
    } else {
      swal("Error", "", "danger");
    }
  };

  // States of Communication Preview Modal
  const [showPreviewCommunicationModal, setShowPreviewCommunicationModal] =
    React.useState(false);
  const PreviewModalClose = () => setShowPreviewCommunicationModal(false);
  const PreviewModalShow = () => setShowPreviewCommunicationModal(true);

  const handleViewDoc = (id) => {
    let checkNotificationFor = paginatedData.find((ele) => +ele.id === +id);

    setnotificationFor(checkNotificationFor?.notification_for_name);
    previewDetdocId((pre) => id);
    PreviewModalShow();
  };
  return (
    <>
      <PageTitle
        activeMenu="Communication List"
        motherMenu="Communication"
        Button={Communication}
        fetchData={fetchData}
      />
      <div className="col-12">
        <div className="card">
          <CardHeader
            handleFilterData={handleFilterData}
            fetchData={fetchData}
          />
          <div className="card-body">
            <div className="w-100 table-responsive">
              <div id="example_wrapper" className="dataTables_wrapper">
                <form>
                  <table id="example" className="display w-100 dataTable">
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Notification Title</th>
                        <th>Message</th>
                        <th>Sub Category</th>
                        <th>Category Type</th>
                        <th>Main Category</th>
                        <th>Notification For</th>
                        <th>Document</th>
                        <th>URL</th>
                        <th>Status</th>
                        <th>Created On</th>
                        <th>View</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedData.length > 0 ? (
                        paginatedData.map((item, index) => (
                          <tr key={index}>
                            <td>{(activePage - 1) * limit + index + 1}</td>
                            <td>{item?.Title}</td>
                            <td>{item?.message || "N/A"}</td>
                            <td>{item.sub_category_name}</td>
                            <td>{item.category_name}</td>
                            <td>{item.main_category_name}</td>
                            <td>{item.notification_for_name}</td>
                            <td>
                              {Object.hasOwn(item, "attachment_url") &&
                              item.attachment_url != null ? (
                                <img
                                  onClick={() => {
                                    setSelectedImage(item.attachment_url);
                                    setShowImageModal(true);
                                  }}
                                  src={item.attachment_url}
                                  alt="document"
                                  width={40}
                                  style={{ cursor: "pointer" }}
                                />
                              ) : (
                                "N/A"
                              )}
                            </td>
                            <td className="cursor-pointer">
                              {item?.url ? (
                                <Link to={`${item?.url}`}>URL</Link>
                              ) : (
                                "URL"
                              )}
                            </td>
                            <td>
                              <Form>
                                <Form.Check
                                  type="switch"
                                  defaultChecked={Boolean(
                                    +item.notification_status
                                  )}
                                  id="custom-switch"
                                  onClick={(e) => handleStatus(e, item.id)}
                                />
                              </Form>
                            </td>

                            <td>
                              {new Date(item.created_at).toLocaleDateString(
                                "en-us",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                  hour: "numeric",
                                  minute: "numeric",
                                  second: "numeric",
                                }
                              )}
                            </td>

                            <td>
                              <i
                                onClick={() => handleViewDoc(item.id)}
                                class="bi bi-eye-fill text-primary"
                              ></i>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center">
                            Data is not available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  <div className="d-flex justify-content-center">
                    <Nav>{pag("", true, "", true, false)}</Nav>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PreviewCommunication
        id={previewDocId}
        notificationFor={notificationFor}
        PreviewModalClose={PreviewModalClose}
        showPreviewCommunicationModal={showPreviewCommunicationModal}
      />

      {/* Image Modal */}
      <ImageModal
        show={showImageModal}
        onHide={() => setShowImageModal(false)}
        imageUrl={selectedImage}
        imageAlt="Document"
      />
    </>
  );
}

export default CommunicationList;
