import React from "react";
import { Modal, Button, ListGroup, Row, Col, Card } from "react-bootstrap";

const ViewSubCategoryModal = ({
  viewShowModal,
  setViewShowModal,
  subCategoryData,
}) => {
  return (
    <Modal className="fade" show={viewShowModal} onHide={() => setViewShowModal(false)}>
      <Modal.Header>
        <Modal.Title>View User Type</Modal.Title>
        <Button
          variant=""
          className="btn-close"
          onClick={() => setViewShowModal(false)}
        ></Button>
      </Modal.Header>
      <Modal.Body>
        <div className="basic-list-group">
          <Row>
            <Col md={6}>
              <Card className="border d-flex justify-content-center">
                <Card.Body>
                  <strong>User Type Name</strong>
                  <p className="mb-0">{subCategoryData?.sub_category_name_view || "N/A"}</p>
                </Card.Body>
              </Card>
            </Col>
            {/* <Col md={6}>
              <Card className="border d-flex justify-content-center">
                <Card.Body>
                  <strong>Slug</strong>
                  <p className="mb-0">{subCategoryData?.sub_category_name_view_url_slug || "N/A"}</p>
                </Card.Body>
              </Card>
            </Col> */}
            {/* <Col md={6}>
              <Card className="border mb-3">
                <Card.Body>
                  <strong>Category Name</strong>
                  <p className="mb-0">{subCategoryData?.parentCategory?.category_name_view || "N/A"}</p>
                </Card.Body>
              </Card>
            </Col> */}
            <Col md={6}>
              <Card className="border mb-3">
                <Card.Body>
                  <strong>Status</strong>
                  <p className="mb-0">
                    {subCategoryData?.active_status == "1" ? "Active" : "Inactive"}
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => setViewShowModal(false)} variant="danger light">
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewSubCategoryModal;
