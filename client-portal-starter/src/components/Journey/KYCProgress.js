import React from "react";
import {
  CardBody, CardTitle, Modal, Button, ModalHeader
} from "reactstrap";
//i18n
import { withTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import CloseButton from "react-bootstrap/CloseButton";

const KYCProgress = (props) => {
  const history = useHistory();
  return (<React.Fragment>
    <Modal
      isOpen={props.isOpen}
      toggle={props?.toggle}
      centered={true}
      //   size="lg"
      className='custom-modal'
    >
      <div style={{
        padding: 20,
      }}>
        <ModalHeader className="d-flex flex-column gap-3">
          <CloseButton
            onClick={props?.toggle}
            style={{ 
              alignSelf: "flex-end",
              position: "absolute", 
              right: 10,
              top: 10 
            }} 
          />
          <div className="text-center">
            <CardTitle className="mb-0">{props.t("Your KYC in under verification process.")}</CardTitle>
          </div>
        </ModalHeader>
        <CardBody>
          <h4 className="m-5 text-center">{props.t("Please wait until your documents are verified")}</h4>
          <div className="text-center">
            <Button onClick={() => { 
              if (history.location.pathname == "/dashboard") {
                props.toggle();
              }
              else {
                props.toggle();
                history.push("/dashboard");
              }
            }} color="success" className="w-lg waves-effect waves-light m-2">
              {props.t("I understand")}
            </Button>
          </div>
        </CardBody>
      </div>
    </Modal>
  </React.Fragment>);
};

export default (withTranslation()(KYCProgress)); 