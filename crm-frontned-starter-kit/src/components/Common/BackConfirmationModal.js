import PropTypes from "prop-types";
import React from "react";
import {
  Col, Modal, ModalBody, Row 
} from "reactstrap";

const DeleteModal = ({ show, onBackClick, onCloseClick, loading = false }) => {
  return (
    <Modal isOpen={show} toggle={onCloseClick} centered={true}>
      <ModalBody className="py-3 px-5">
        <Row>
          <Col lg={12}>
            <div className="text-center">
              <i
                className="mdi mdi-alert-circle-outline"
                style={{
                  fontSize: "9em",
                  color: "orange" 
                }}
              />
              <h2>Are you sure?</h2>
              <h4>{"Your updates won't be saved !"}</h4>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="text-center mt-3">
              <button
                disabled={loading}
                type="button"
                className="btn btn-success btn-lg ms-2"
                onClick={onBackClick}
              >
                Yes, Go back!
              </button>
              <button
                disabled={loading}
                type="button"
                className="btn btn-danger btn-lg ms-2"
                onClick={onCloseClick}
              >
                Cancel
              </button>
            </div>
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  );
};

DeleteModal.propTypes = {
  onCloseClick: PropTypes.func,
  onBackClick: PropTypes.func,
  show: PropTypes.any
};

export default DeleteModal;