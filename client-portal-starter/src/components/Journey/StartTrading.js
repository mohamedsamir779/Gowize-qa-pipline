import React from "react";
import { connect } from "react-redux";
import {
  CardTitle, Modal, Button, ModalBody, ModalHeader
} from "reactstrap";
import { HIDE_JOU_TRADING } from "common/data/jourenykeys";
import { CloseButton } from "react-bootstrap";

const StartTrading = (props) => {
  const hideModal = localStorage.getItem(HIDE_JOU_TRADING) === "true";

  return (<React.Fragment>
    <Modal
      isOpen={props.show && !hideModal}
      toggle={props.toggle}
      centered={true}
      //   size="lg"
      className='custom-modal'
    >
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
          <CardTitle className="mb-0">{props.t("Start Trading")}</CardTitle>
        </div>
      </ModalHeader>
      <ModalBody>
        <div className="text-center">
          <Button onClick={props.toggle} color="danger" className="w-lg waves-effect waves-light m-2">
            {props.t("Skip")}
          </Button>
          <Button onClick={()=>{ 
            // check if already on web trader page
            if (props.history.location.pathname === "/platforms") {
              props.toggle();
            }
            else {
              props.toggle();
              props.history.push("/platforms");
            }
          }} color="success" className="w-lg waves-effect waves-light m-2">
            {props.t("Start Trading")}
          </Button>
          {/* <Button onClick={()=>{ props.history.push("/quick-buy") }} color="success" className="blue-gradient-color w-lg waves-effect waves-light m-2">
              Start Trading
          </Button> */}
        </div>
      </ModalBody>
    </Modal>
  </React.Fragment>);
};

const mapStateToProps = (state) => ({
  profile: state.Profile && state.Profile.clientData || {},
});
export default connect(mapStateToProps, null)(StartTrading);