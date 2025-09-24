import React from "react";
import { connect } from "react-redux";
import {
  CardBody, CardTitle, Modal, Button, ModalHeader
} from "reactstrap";
//i18n
import { withTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import CloseButton from "react-bootstrap/CloseButton";

const SubmitProfile = (props) => {
  const history = useHistory();
  return (<React.Fragment>
    <Modal
      isOpen={props.show}
      toggle={() => props.toggle()}
      centered={true}
      //   size="lg"
      className='custom-modal'
    >
      <div style={{
        padding: 20,
      }}>
        <ModalHeader className="d-flex flex-column gap-3">
          <CloseButton
            onClick={() => props.toggle()}
            style={{ 
              alignSelf: "flex-end",
              position: "absolute", 
              right: 10,
              top: 10 
            }} 
          />
          <div className="text-center">
            <CardTitle className="mb-0">{props.t("Upload Your KYC")}</CardTitle>
          </div>
        </ModalHeader>
        <CardBody>
          <h4 className="m-5 text-center">{props.t("Upload your documents")}</h4>
          <div className="text-center">
            <Button onClick={props.toggle} color="danger" className="w-lg waves-effect waves-light m-2">
              {props.t("Skip")}
            </Button>
            <Button onClick={() => { 
              if (history.location.pathname === "/documents") {
                props.toggle();
              }
              else {
                props.toggle();
                history.push("/documents");
              }
            }} color="success" className="w-lg waves-effect waves-light m-2">
              {props.t("Continue")}
            </Button>
          </div>
        </CardBody>
      </div>
    </Modal>
  </React.Fragment>);
};

const mapStateToProps = (state) => ({
  profile: state.Profile && state.Profile.clientData || {},
});
export default connect(mapStateToProps, null)(withTranslation()(SubmitProfile)); 