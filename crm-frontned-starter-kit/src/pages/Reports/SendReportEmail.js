import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { AvField, AvForm } from "availity-reactstrap-validation";
import AvFieldSelect from "components/Common/AvFieldSelect";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { showSuccessNotification, showErrorNotification } from "store/notifications/actions";
import { sendUserEmail } from "apis/users";
import useModal from "hooks/useModal";
import { startCase } from "lodash";
import { downloadReport } from "apis/reports";
import {
  toBase64, getBase64ContentType, removeBase64Metadata
} from "helpers/base64";


function SendReportEmail({ reportValues, t }) {
  const dispatch = useDispatch();
  const [show, toggle] = useModal();
  const [emails, setEmails] = useState([]);
  const { currentProvider, sendGrid, smtp } = useSelector((state) => state.Profile.emails) || {};

  useEffect(() => {
    if (currentProvider === "sendGrid") {
      setEmails([sendGrid]);
    } else if (currentProvider === "smtp") {
      setEmails([smtp]);
    }
  }, [currentProvider, sendGrid, smtp]);

  return (
    <React.Fragment >
      <div>
        <Button
          color="primary"
          size="sm"
          disabled={!reportValues.reportType}
          onClick={toggle}
        >
          {t("Send As Email")}
        </Button>
      </div>
      <Modal isOpen={show} toggle={toggle} centered={true}>
        <ModalHeader toggle={toggle}>
          {t("Send Report As Email")}
        </ModalHeader>
        <ModalBody >
          <AvForm onValidSubmit={async (e, v) => {
            toggle();
            downloadReport(reportValues)
              .then(async (blob) => {
                const base64 = await toBase64(blob);
                sendUserEmail({
                  ...v,
                  subject: `${startCase(reportValues.reportType)} Report`,
                  body: `Please find the attached ${startCase(reportValues.reportType)} Report below.`,
                  provider: currentProvider,
                  attachments: [{
                    content: removeBase64Metadata(base64),
                    type: getBase64ContentType(base64),
                    filename: `${reportValues.reportType}-report.xlsx`,
                    disposition: "attachment",
                  }],
                }).then(() => {
                  dispatch(showSuccessNotification("Email sent successfully"));
                }).catch(() => {
                  dispatch(showErrorNotification("Error while sending email"));
                });
              });
          }} >
            <AvFieldSelect
              name="from"
              label={t("From")}
              options={emails.length > 0
                ? emails.map((email) => {
                  return {
                    value: email,
                    label: email?.fromEmail
                  };
                }) : ""
              }
              required
            />
            {emails.length < 1
              && <small className="d-flex justify-content-end">
                {t("Don't have an email?")}&nbsp;<Link to="/profile" className="fw-bold">{t("Link one")}</Link>
              </small>}
            <AvField
              name="to"
              label={t("To")}
            />
            <ModalFooter className="d-flex justify-content-center pb-0">
              <Button type="submit" color="primary">
                {t("Send")}
              </Button>
            </ModalFooter>
          </AvForm>
        </ModalBody>
      </Modal>
    </React.Fragment >
  );
}

export default withTranslation()(SendReportEmail);