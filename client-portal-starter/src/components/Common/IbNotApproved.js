import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import {  Modal, ModalBody } from "reactstrap";

const IbNotApproved = () => {
  const { t } = useTranslation();
  const history = useHistory();
  return (
    <Modal isOpen={true} centered={true}>
      <ModalBody className="text-center">
        <h4>{t("Agreement not Approved")}</h4>
        <div className="d-flex align-items-center justify-content-between text-start">
          <i className="mdi mdi-alert-circle-outline text-danger me-3" style={{ fontSize: "3.7rem" }} />
          <p className="fs-5 lh-1">{t("Your agreement is not approved yet. please submit the agreement and wait for the approval to start using IB Portal")}</p>
        </div>
        <div className="text-center">
          <button
            type="button"
            className="btn border-0 color-bg-btn shadow text-white"
            onClick={() => history.push("/dashboard")}
          >
            {t("Dashboard")}
          </button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default IbNotApproved;