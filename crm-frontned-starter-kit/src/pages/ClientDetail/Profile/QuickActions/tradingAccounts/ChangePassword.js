import React, { useDispatch, useSelector } from "react-redux";
import {
  AvForm, AvField, AvGroup, AvFeedback
} from "availity-reactstrap-validation";
import {
  Modal, ModalHeader, ModalBody, Button, Col, Label, Row,
} from "reactstrap";
import { useTranslation } from "react-i18next";
import Loader from "components/Common/Loader";
import { useEffect, useState } from "react";
import { updatePassword } from "store/actions";
import AvFieldSelect from "components/Common/AvFieldSelect";

const TYPES = [
  {
    value: "main",
    label: "Main",
  },
  {
    value: "investor",
    label: "Investor",
  },
];

const ChangePassword = ({ show, toggle, selectedAcc }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const tradingAccounts = useSelector((state) => state.tradingAccountReducer.accounts.docs);
  const [selectedAccount, setSelectedAccount] = useState(tradingAccounts && tradingAccounts[0]);

  useEffect(() => {
    if (selectedAcc) {
      setSelectedAccount(selectedAcc);
    }
  }, [selectedAcc]);

  const { submitting, error } = useSelector((state) => state.tradingAccountReducer);
  
  useEffect(() => {
    if (submitting === false && error === null && show === true) {
      toggle();
    }
  }, [submitting]);

  return (
    <>
      <button
        type="button"
        className="btn btn-primary waves-effect waves-light w-100 me-1"
        onClick={toggle}
      >
        {t("Reset Password")}
      </button>
      <Modal centered isOpen={show} toggle={toggle}>
        <ModalHeader toggle={toggle} tag="h4">
          {t("Change Password")}
        </ModalHeader>
        <ModalBody>
          <AvForm
            onValidSubmit={(e, v) => {
              dispatch(updatePassword({
                _id: v.account._id,
                body: {
                  login: v.account.login,
                  type: v.type,
                },
              }));
            }}
          >
            <AvFieldSelect name="account"
              className="form-select mt-1 mb-2"
              label={t("Account Login")}
              value={selectedAccount}
              options={tradingAccounts?.map((account) => ({
                value: account,
                label: account.login,
              }))}
              onChange={(e) => {
                setSelectedAccount(e.value);
              }}
            />
            <AvField type="select" name="type"
              label={t("Select Password Type")}
              value={TYPES[0].value}
              className="form-select mt-1 mb-2"
            >
              {TYPES?.map((type) =>
                <option key={type.value} value={type.value}>{type.label}</option>
              )};
            </AvField>
            <div className="text-center mt-3 mb-1">
              {
                submitting
                  ? <Loader />
                  : <Button type="submit" className="border-0 color-bg-btn shadow">{t("Change")}</Button>
              }
            </div>
          </AvForm>
        </ModalBody>
      </Modal>
    </>
  );
};

export default ChangePassword;