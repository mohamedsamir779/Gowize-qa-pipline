import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert } from "reactstrap";
import { fetchDocsStart } from "../../../../store/general/documents/actions.js";

const CheckKYC = ({ t, setIsFirstStepValid }) => {
  const { documents, loading } = useSelector((state) => state?.documents);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchDocsStart());
  }, []);

  const isApproved =
    documents.length >= 2 &&
    documents[0]?.status === "APPROVED" &&
    documents[1]?.status === "APPROVED";

  if (loading) {
    return null;
  }
  if (documents.length < 2) {
    return (
      <div className="mt-4">
        <Alert color="warning">
          <h5 className="alert-heading">{t("Documents Required")}</h5>
          <p>
            {t("Please submit all required KYC documents for verification.")}
          </p>
        </Alert>
      </div>
    );
  }
  const pendingDocs = documents.filter((doc) => doc.status === "PENDING");
  const rejectedDocs = documents.filter((doc) => doc.status === "REJECTED");
  if (rejectedDocs.length > 0) {
    return (
      <div className="mt-4">
        <Alert color="danger">
          <h5 className="alert-heading">{t("Verification Rejected")}</h5>
          <p>
            {t(
              `Your ${rejectedDocs.map((doc) => doc.type).join(" and ")} ${
                rejectedDocs.length > 1 ? "were" : "was"
              } rejected. Please update ${
                rejectedDocs.length > 1 ? "them" : "it"
              } to proceed.`
            )}
          </p>
        </Alert>
      </div>
    );
  }
  if (pendingDocs.length > 0) {
    return (
      <div className="mt-4">
        <Alert color="warning">
          <h5 className="alert-heading">{t("Verification Pending")}</h5>
          <p>
            {t(
              `Your ${pendingDocs.map((doc) => doc.type).join(" and ")} ${
                pendingDocs.length > 1 ? "are" : "is"
              } under review. Please wait for approval.`
            )}
          </p>
        </Alert>
      </div>
    );
  }

  if (isApproved) {
    setIsFirstStepValid(true);
  }
  return null;
};

export default CheckKYC;