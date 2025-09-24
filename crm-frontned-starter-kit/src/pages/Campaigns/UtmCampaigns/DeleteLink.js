import React, { useState } from "react";
import {
  Col, Modal, ModalBody, Row 
} from "reactstrap";
import * as linksAPI from "apis/campaigns/links";
import { useDispatch } from "react-redux";
import { showErrorNotification, showSuccessNotification } from "store/actions";

function DeleteLink(props) {
  const { show, onCloseClick, link } = props;
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const deleteLink = async () => {
    try {
      setLoading(true);
      const campaignToken = link?.fullUrl?.split("utm-campaign=")[1].split("&")[0];
      const res = await linksAPI.deleteLink(campaignToken);
      if (res.isSuccess){
        dispatch(showSuccessNotification("Link deleted Successfully"));
        onCloseClick();
      } else {
        dispatch(showErrorNotification(res.error));
      }
      setLoading(false);
    } catch (error) {
      dispatch(showErrorNotification(error.message));
      setLoading(false);
    }
  };
  return ( <Modal isOpen={show} toggle={onCloseClick} centered={true}>
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
              onClick={deleteLink}
            >
            Yes
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
  </Modal> );
}

export default DeleteLink;