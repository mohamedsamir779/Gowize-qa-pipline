import React from "react";
import { connect } from "react-redux";
import {
  CardBody, CardHeader, CardTitle, Modal, Button, ModalBody
} from "reactstrap";
import { HIDE_JOU_FUND } from "common/data/jourenykeys";
import { CloseButton } from "react-bootstrap";
const SubmitProfile = (props) => {
  const hideModal = localStorage.getItem(HIDE_JOU_FUND) === "true";
  return (<React.Fragment>
    <Modal
      isOpen={props.show && !hideModal}
      toggle={()=>props.toggle()}
      centered={true}
      //   size="lg"
      className='custom-modal'
    >
      <ModalBody>
        {/* <Card> */}
        <CardHeader className="d-flex flex-column gap-3">
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
            <CardTitle className="mb-0">{props.t("Fund Now")}</CardTitle>
          </div>
        </CardHeader>
        <CardBody>
          <h4 className="m-5 text-center">{props.t("Want to start Trading ? Fund Now ")}!!!</h4>
          <div className="text-center">
            <Button onClick={props.toggle} color="danger" className="w-lg waves-effect waves-light m-2">
              {props.t("Skip")}
            </Button>
            <Button onClick={()=>{ props.history.push("/wallet") }} color="success" className="w-lg waves-effect waves-light m-2">
              {props.t("Fund Now")}
            </Button>
            {/* <Button onClick={()=>{ props.history.push("/quick-buy") }} color="success" className="blue-gradient-color w-lg waves-effect waves-light m-2">
                Start Trading
            </Button> */}
          </div>
        </CardBody>
        {/* </Card> */}
      </ModalBody>


    </Modal>
  </React.Fragment>);
};

const mapStateToProps = (state) => ({
  profile: state.Profile && state.Profile.clientData || {},
});
export default connect(mapStateToProps, null)(SubmitProfile);