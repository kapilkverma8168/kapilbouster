import React from "react";
import "../eventCalendar/EventCalendar.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import PageTitle from "../../../jsx/layouts/PageTitle";
import EventNotificationModal from "./EventCalendarModal";
import swal from "sweetalert";
import { Nav, Pagination } from "react-bootstrap";
import { Link } from "react-router-dom";
import PreviewEventCalendarModal from "./PreviewEventCalendarModal";
import {
  getAllEventCalendarData,
  updateEventCalendarStatus,
} from "../../../services/adminApiService/eventCalendarApis/eventCalendarApis";
import ImageModal from "../../../components/ImageModal";

function EventCalendar() {
  const [hoveredItemId, setHoveredItemId] = React.useState(null);
  const [data, setData] = React.useState([]);
  const [showWebsiteModal, setShowWebsiteModal] = React.useState(false);
  const [PreviewEventModal, setPreviewEventModal] = React.useState(false);
  const PreviewModalClose = () => setPreviewEventModal(false);
  const PreviewModalShow = () => setPreviewEventModal(true);
  const [eventDocPreviewID, seteventDocPreviewID] = React.useState(null);
  const [limit, setLimit] = React.useState(50);
  const [totalPages, setTotalPages] = React.useState(0);
  const [activePage, setActivePage] = React.useState(1);
  const [paginationStart, setPaginationStart] = React.useState(1);
  const [showImageModal, setShowImageModal] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState("");

  const handleStatus = async (e, id) => {
    let res = await updateEventCalendarStatus(id, Number(e.target.checked));
    if (res?.data?.status) {
      swal(res?.data?.message, "", "success");
    } else {
      swal("Error", "", "danger");
    }
  };

  // VIEW DOCUMENT
  const handleViewDoc = (id) => {
    seteventDocPreviewID(id);
    PreviewModalShow();
  };
  // FETCH LISTING DATA
  async function fetchData() {
    try {
      let res = await getAllEventCalendarData();
      let data = res?.data?.data?.data?.map((ele) => ele);
      setData(data);
    } catch (error) {
      console.log(error.message);
    }
  }
  React.useEffect(() => {
    fetchData();
  }, []);
  // PAGINATION

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

  React.useEffect(() => {
    setTotalPages(Math.ceil(data?.length / limit));
  }, [data, limit]);
  const paginatedData = data
    ?.slice((activePage - 1) * limit, activePage * limit)
    ?.reverse();

  React.useEffect(() => {
    if (activePage < paginationStart) {
      setPaginationStart(Math.max(activePage - 4, 1));
    } else if (activePage >= paginationStart + 5) {
      setPaginationStart(activePage - 4);
    }
  }, [activePage]);

  const handleCloseWebsiteModal = () => setShowWebsiteModal(false);
  const handleShowWebsiteModal = () => setShowWebsiteModal(true);

  return (
    <>
      <PageTitle
        activeMenu={"Event Calendar"}
        motherMenu={"Events"}
        Button={() => (
          <Button onClick={handleShowWebsiteModal}>Add Event</Button>
        )}
      />
      <div className="e-tender-table-content">
        <div className="table2" id="jharkhand-e-tender-table">
          <div
            className={`${`E-tender-fopTableHeader`} position-relative py-4 body-text`}
          >
            <div>S. No</div>
            <div>Title</div>
            <div>Description</div>
            <div>URL</div>
            <div>Document</div>
            <div>Created On</div>
            <div>Enable/Disable</div>
            <div>View</div>
          </div>
          <div className="bodyContainer">
            {paginatedData?.length > 0 ? (
              paginatedData?.map((item, index) => (
                <div
                  className={`E-tender-fopDivContainer ${
                    hoveredItemId === item.id ? "hovered" : ""
                  }`}
                  key={index}
                  onMouseEnter={() => setHoveredItemId(item.id)}
                  onMouseLeave={() => setHoveredItemId(null)}
                >
                  <div>{index + 1}</div>
                  <div>{item.title}</div>
                  <div className="m-4">{item.description}</div>
                  <div className="m-4">
                    <Link>URL</Link>
                  </div>
                  <div className="m-4">
                    {item.attachement_storage_url ? (
                      <img
                        onClick={() => {
                          setSelectedImage(item.attachement_storage_url);
                          setShowImageModal(true);
                        }}
                        src={`${item.attachement_storage_url}`}
                        width={40}
                        alt=""
                      />
                    ) : (
                      "N/A"
                    )}
                  </div>
                  <div className="m-4">
                    {new Date(item.created_at).toLocaleDateString("en-us", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                      second: "numeric",
                    })}
                  </div>
                  <div className="m-4">
                    <td>
                      <Form>
                        <Form.Check
                          defaultChecked={Boolean(+item.status)}
                          onChange={(e) => handleStatus(e, item.id)}
                          type="switch"
                          id="custom-switch"
                        />
                      </Form>
                    </td>
                  </div>
                  <td>
                    <i
                      onClick={() => handleViewDoc(item.id)}
                      className="bi bi-eye-fill text-primary"
                    ></i>
                  </td>
                </div>
              ))
            ) : (
              <div className="d-flex justify-content-center">
                Data is not available
              </div>
            )}

            <div className="d-flex justify-content-center">
              <Nav>{pag("", true, "", true, false)}</Nav>
            </div>
          </div>
        </div>
      </div>
      {eventDocPreviewID && (
        <PreviewEventCalendarModal
          PreviewModalClose={PreviewModalClose}
          setPreviewEventModal={setPreviewEventModal}
          PreviewEventModal={PreviewEventModal}
          eventDocPreviewID={eventDocPreviewID}
          seteventDocPreviewID={seteventDocPreviewID}
        />
      )}
      <EventNotificationModal
        fetchData={fetchData}
        handleCloseWebsiteModal={handleCloseWebsiteModal}
        showWebsiteModal={showWebsiteModal}
      />

      {/* Image Modal */}
      <ImageModal
        show={showImageModal}
        onHide={() => setShowImageModal(false)}
        imageUrl={selectedImage}
        imageAlt="Event Document"
      />
    </>
  );
}

export default EventCalendar;
