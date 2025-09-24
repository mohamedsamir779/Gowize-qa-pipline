import React from "react";
import { CloseButton } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import {
  Modal, ModalBody, ModalHeader,
} from "reactstrap";

const AllAccountsModal = ({ show, toggle, accounts }) => {
  const { t } = useTranslation();
  return (
    <Modal isOpen={show} toggle={toggle} centered={true} scrollable={true}>
      <ModalHeader toggle={toggle} tag="h4">
        <CloseButton
          onClick={() => toggle()}
          style={{ 
            alignSelf: "flex-end",
            position: "absolute", 
            right: 10,
            top: 10 
          }} 
        />
        {t("Accounts")}
      </ModalHeader>
      <ModalBody >
        {accounts.join(", ")}
      </ModalBody>
    </Modal >
  );
};

export default AllAccountsModal;
