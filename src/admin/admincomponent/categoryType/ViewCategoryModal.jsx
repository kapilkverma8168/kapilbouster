import React from "react";
import { Button, Modal, Row, Col, Card } from "react-bootstrap";

const ViewCategoryModal = ({
  viewShowModal,
  setViewShowModal,
  categoryidList,
}) => {
  console.log("categoryidList===>", categoryidList);
  return (
    <Modal className="fade" show={viewShowModal} onHide={() => setViewShowModal(false)}>
      <Modal.Header>
        <Modal.Title>View Category</Modal.Title>
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
                  <strong>Category Name</strong>
                  <p className="mb-0">{categoryidList?.category_name_view || "N/A"}</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="border d-flex justify-content-center">
                <Card.Body>
                  <strong>Parent Category</strong>
                  <p className="mb-0">
                    {categoryidList?.mainCategory?.main_category_name || "N/A"}
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="border d-flex justify-content-center">
                <Card.Body>
                  <strong>Status</strong>
                  <p className="mb-0">
                    {categoryidList?.active_status == "1" ? "Active" : "Inactive"}
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

export default ViewCategoryModal;
