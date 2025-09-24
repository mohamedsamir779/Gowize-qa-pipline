import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { MetaTags } from "react-meta-tags";
import { showSuccessNotification, showErrorNotification } from "store/notifications/actions";
import { editAllTargets, getCanBeAssignedUserTargets } from "apis/users";
import {
  Button, Card, Col, Row
} from "reactstrap";
import { AvField, AvForm } from "availity-reactstrap-validation";
import validatePositiveInputs from "helpers/validatePositiveInputs";
import TableLoader from "components/Common/Loader";

function Targets() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [target, setTarget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  useEffect(async () => {
    if (submitting) return;
    await getCanBeAssignedUserTargets()
      .then((data) => {
        const element = {};
        data.docs.forEach(obj => {
          element[obj._id] = {
            _id: obj.targetId?._id,
            name: `${obj.firstName} ${obj.lastName}`,
            deposit: obj.targetId?.fx.deposit || "0",
            accounts: obj.targetId?.accounts || "0",
            ibAccounts: obj.targetId?.ibAccounts || "0",
            volume: obj.targetId?.volume || "0"
          };
        });
        setTarget(element);
        setLoading(false);
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.error(e);
        setLoading(false);
      });
  }, [submitting]);

  return (
    <React.Fragment>
      <MetaTags>
        <title>{t("Targets")}</title>
      </MetaTags>
      <div className="page-content">
        <div className="container-fluid">
          <h2>{t("Targets")}</h2>
          <Card className="p-4">
            <Row className="justify-content-center fw-bold mb-4">
              <Col md={1}>{t("Name")}</Col>
              <Col md={1}>{t("Money In")}</Col>
              <Col md={1}>{t("Accounts")}</Col>
              <Col md={1}>{t("IB Accounts")}</Col>
              <Col md={1}>{t("Volume")}</Col>
            </Row>
            {loading && <TableLoader />}
            {target
              && <AvForm
                onValidSubmit={async (e, v) => {
                  setSubmitting(true);
                  const arr = [];
                  Object.keys(v).forEach((item) => {
                    arr.push({
                      userId: item,
                      ...v[item]
                    });
                  });
                  try {
                    const res = await editAllTargets({ targets: arr });
                    if (res) {
                      setSubmitting(false);
                      dispatch(showSuccessNotification("Targets updated successfully"));
                    }
                  } catch (error) {
                    setSubmitting(false);
                    dispatch(showErrorNotification("Failed to update targets"));
                  }
                }}
              >
                {Object.keys(target).map((item) =>
                  <Row key={item} className="justify-content-center">
                    <AvField
                      name={`${item}._id`}
                      type="hidden"
                      value={target[item]?._id ?? ""}
                    />
                    <Col md={1} className="text-truncate">
                      {target[item]?.name}
                    </Col>
                    <Col md={1}>
                      <AvField
                        name={`${item}.fx.deposit`}
                        type="number"
                        value={target[item]?.deposit}
                        min="0"
                        errorMessage="Enter money in amount"
                        validate={{ required: { value: true } }}
                        onKeyPress={(e) => validatePositiveInputs(e)}
                      />
                    </Col>
                    <Col md={1}>
                      <AvField
                        name={`${item}.accounts`}
                        type="number"
                        value={target[item]?.accounts}
                        min="0"
                        errorMessage="Enter no. of accounts"
                        validate={{ required: { value: true } }}
                        onKeyPress={(e) => validatePositiveInputs(e)}
                      />
                    </Col>
                    <Col md={1}>
                      <AvField
                        name={`${item}.ibAccounts`}
                        type="number"
                        value={target[item]?.ibAccounts}
                        min="0"
                        errorMessage="Enter no. of IB accounts"
                        validate={{ required: { value: true } }}
                        onKeyPress={(e) => validatePositiveInputs(e)}
                      />
                    </Col>
                    <Col md={1}>
                      <AvField
                        name={`${item}.volume`}
                        type="number"
                        value={target[item]?.volume}
                        min="0"
                        errorMessage="Enter volume amount"
                        validate={{ required: { value: true } }}
                        onKeyPress={(e) => validatePositiveInputs(e)}
                      />
                    </Col>
                  </Row>)}
                <div className="text-center">
                  {submitting
                    ? <TableLoader />
                    : <Button color="primary" type="submit">
                      {t("Update")}
                    </Button>}
                </div>
              </AvForm>}
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
}
export default Targets;
