import React from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Row,
} from "reactstrap";
import { withTranslation } from "react-i18next";

function ReceiptModal(props){
  const { content, open, onClose } = props;
  const baseUrl = process.env.REACT_APP_API_CRM_DOMAIN;
  console.log("content", content);
  return (
    <React.Fragment>
      <div>
        <Modal isOpen= {open} toggle = {onClose} centered = {true} size = {"lg"}>
          <ModalHeader toggle = {onClose} tag="h4">
            {props.t(content?.type === "image" ? "Receipt" : "Details")}
          </ModalHeader>
          <ModalBody>
            {
              content?.type === "image" ? (<>
                <img
                  src={`${baseUrl}/assets/${content.content}`}
                  alt="Receipt"
                  style={{ width: "100%" }}
                />
              </>) : 
                <>
                  <Row>
                    {Object.keys(content?.content || {}).map((key) => (
                      <>
                        <div className="col-12">
                          <p className="mb-1">
                            <strong>{key}</strong>
                          </p>
                          <p className="text-muted" >{content?.content?.[key]}</p>
                        </div>
                      </>
                    ))}
                  </Row>
                </>
            }
          </ModalBody>
        </Modal>
      </div>
    </React.Fragment>
  );
}
export default withTranslation()(ReceiptModal);