import React from "react";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";
import {
  getAllNotificationDetails,
  updateWebsiteNotificationStatus,
} from "../../../../services/adminApiService/communicateApi/communicateApi";
import { Nav, Pagination } from "react-bootstrap";
import Communication from "../Communication";
import swal from "sweetalert";
import PageTitle from "../../../../jsx/layouts/PageTitle";
import PreviewCommunicationModal from "../PreviewCommunicationModal";
import DateRangePicker from "react-bootstrap-daterangepicker";
import ImageModal from "../../../../components/ImageModal";

// const ALLOWED_CHARACTERS_REGEX = /^[a-zA-Z0-9\s()]*$/;
const ALLOWED_CHARACTERS_REGEX = /^[a-zA-Z0-9\s\()\.\,\-\!\:\&]*$/;

const CardHeader = ({
  handleSearchValue,
  searchByTitle,
  handleApply,
  Error,
}) => {
  return (
    <div className="card-header d-flex gap-2">
      <div>
        <div className="input-group search-area">
          <input
            value={searchByTitle}
            onChange={handleSearchValue}
            type="text"
            className={`form-control `}
            placeholder="Search here..."
          />
          <span className="input-group-text">
            <Link to={"#"}>
              <i className="flaticon-381-search-2"></i>
            </Link>
          </span>
        </div>
        <span className="validation-text text-danger">
          {Error.titleError && Error.titleError}
        </span>
      </div>
      <div>
        <DateRangePicker onApply={handleApply}>
          <input type="text" className="form-control" />
        </DateRangePicker>
      </div>
    </div>
  );
};
function WebsiteNotification() {
  const [data, setData] = React.useState([]);
  const [limit, setLimit] = React.useState(50);
  const [totalPages, setTotalPages] = React.useState(0);
  const [activePage, setActivePage] = React.useState(1);
  const [paginationStart, setPaginationStart] = React.useState(1);
  const [previewDocId, previewDetdocId] = React.useState(null);
  const [notificationFor, setnotificationFor] = React.useState("");
  const [searchByTitle, setsearchByTitle] = React.useState("");
  const debounceTimeout = React.useRef(null);
  const [Error, setError] = React.useState({ titleError: "" });
  const [dateRange, setDateRange] = React.useState({
    startDate: "",
    endDate: "",
  });
  const [showImageModal, setShowImageModal] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState("");
  // Recalculate totalPages whenever data or limit changes
  React.useEffect(() => {
    setTotalPages(Math.ceil(data?.length / limit));
  }, [data, limit]);

  const paginatedData = data?.slice(
    (activePage - 1) * limit,
    activePage * limit
  );

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
  async function fetchData(payload = {}) {
    try {
      let res = await getAllNotificationDetails(payload);
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

  const handleStatus = async (e, id) => {
    let res = await updateWebsiteNotificationStatus(
      id,
      Number(e.target.checked)
    );

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

  //  handleSearchValue

  const handleSearchValue = (e) => {
    if (!ALLOWED_CHARACTERS_REGEX.test(e.target.value)) {
      setError({ ...Error, titleError: "You can't use special Character" });
    } else {
      setError({ ...Error, titleError: "" });
    }
    setsearchByTitle(e.target.value);
    debounceSearch(e.target.value);
  };

  const debounceSearch = (value) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(async () => {
      let formData = new FormData();
      formData.append("title", value);
      await fetchData(formData);
    }, 500);
  };

  // date range

  const handleApply = async (event, picker) => {
    const formattedStartDate = picker.startDate.format("YYYY-MM-DD");
    const formattedEndDate = picker.endDate.format("YYYY-MM-DD");

    setDateRange({
      ...dateRange,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    });

    let formData = new FormData();
    formData.append("title", searchByTitle);
    formData.append("start_date", formattedStartDate);
    formData.append("end_date", formattedEndDate);
    await fetchData(formData);
  };

  React.useEffect(() => {}, [dateRange]);

  React.useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);
  return (
    <>
      <PageTitle
        activeMenu="Website Notification List"
        motherMenu="Communication"
        Button={Communication}
        fetchData={fetchData}
      />
      <div className="col-12">
        <div className="card">
          <CardHeader
            handleSearchValue={handleSearchValue}
            searchByTitle={searchByTitle}
            setDateRange={setDateRange}
            dateRange={dateRange}
            handleApply={handleApply}
            Error={Error}
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
                        <th>Document</th>
                        <th>URL</th>
                        <th>Status</th>
                        <th>Created On</th>
                        <th>View</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedData?.length > 0 ? (
                        paginatedData?.map((item, index) => (
                          <tr key={index}>
                            <td>{(activePage - 1) * limit + index + 1}</td>
                            <td>{item?.title}</td>
                            <td>{item?.message || "N/A"}</td>
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
                                // <img
                                //   src={
                                //     "https://cdn-icons-png.flaticon.com/512/6747/6747196.png"
                                //   }
                                //   alt="document"
                                //   width={40}
                                // />
                                "N/A"
                              )}
                            </td>
                            <td>
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

      <PreviewCommunicationModal
        id={previewDocId}
        PreviewModalClose={PreviewModalClose}
        showPreviewCommunicationModal={showPreviewCommunicationModal}
        notificationFor={notificationFor}
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

export default WebsiteNotification;
