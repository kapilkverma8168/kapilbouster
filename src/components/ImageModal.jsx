import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ImageModal = ({ show, onHide, imageUrl, imageAlt = "Image" }) => {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Image Preview</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center p-0">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={imageAlt}
            style={{
              maxWidth: '80%',
              maxHeight: '85vh',
              objectFit: 'contain'
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.outerHTML = '<div class="text-center p-4">Image could not be loaded</div>';
            }}
          />
        )}
      </Modal.Body>
      {/* <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          <i className="fa fa-times me-2"></i>
          Close
        </Button>
      </Modal.Footer> */}
    </Modal>
  );
};

export default ImageModal;
