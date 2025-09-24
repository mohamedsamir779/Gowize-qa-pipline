import React from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Card
} from "reactstrap";
import { captilazeFirstLetter } from "common/utils/manipulateString";
import { withTranslation } from "react-i18next";

function DetailsModal(props){
  const { rawData, open, onClose } = props;
  
  return (
    <React.Fragment>
      <div>
        <Modal isOpen= {open} toggle = {onClose} centered = {true} size = {"lg"}>
          <ModalHeader toggle = {onClose} tag="h4">
            {props.t("Details")}
          </ModalHeader>
          <ModalBody>
            <div >
              {Object.keys(rawData).length > 0 ? Object.keys(rawData).map(key => {
                return <Card className="p-3" key={rawData[key]}>
                  <p className="d-flex center-vertically"><span className="bold">{`${captilazeFirstLetter((key))} `} </span> : <span>{` ${(rawData?.[key] || "-")}`}</span></p> 
                </Card>;
              }) : "" }
            </div>
          </ModalBody>
        </Modal>
      </div>
    </React.Fragment>
  );
}
export default withTranslation()(DetailsModal);