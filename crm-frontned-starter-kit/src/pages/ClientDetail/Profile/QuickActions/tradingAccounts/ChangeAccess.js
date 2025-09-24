import React, { useDispatch, useSelector } from "react-redux";
import { AvForm, AvField } from "availity-reactstrap-validation";
import {
  Modal, ModalHeader, ModalBody, Button,
} from "reactstrap";
import { useTranslation } from "react-i18next";
import Loader from "components/Common/Loader";
import { useEffect } from "react";
import { changeAccess } from "store/actions";

const ChangeAccess = ({ show, toggle, selectedAccount }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const tradingAccounts = useSelector((state) => state.tradingAccountReducer.accounts.docs);
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
        {t("Change Access")}
      </button>
      <Modal centered isOpen={show} toggle={toggle}>
        <ModalHeader toggle={toggle} tag="h4">
          {t("Change Access")}
        </ModalHeader>
        <ModalBody>
          <AvForm
            onValidSubmit={(e, v) => {
              v.isActivating = JSON.parse(v.isActivating);
              dispatch(changeAccess(v));
            }}
          >
            <AvField type="select" name="login"
              label={t("Account Login")}
              value={selectedAccount?.login ?? (tradingAccounts && +tradingAccounts[0]?.login)}
              className="form-select mt-1 mb-2"
            >
              {tradingAccounts?.map((account) =>
                <option key={account.login} value={+account.login}>{`${account.login} (${account.isActive ? "Active" : "Inactive"})`}</option>
              )};
            </AvField>
            <AvField type="select" name="isActivating"
              value={true}
              label={t("Action")}
              className="form-select mt-1">
              <option value={true}>{t("Activate")}</option>
              <option value={false}>{t("Deactivate")}</option>
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

export default ChangeAccess;