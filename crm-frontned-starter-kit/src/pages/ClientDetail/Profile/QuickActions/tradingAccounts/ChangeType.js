import React, { useDispatch, useSelector } from "react-redux";
import {
  AvForm, AvRadioGroup, AvRadio
} from "availity-reactstrap-validation";
import {
  Modal, ModalHeader, ModalBody, Button, Row, Col,
} from "reactstrap";
import { useTranslation } from "react-i18next";
import Loader from "components/Common/Loader";
import { useEffect, useState } from "react";
import { updateType } from "store/actions";
import AvFieldSelect from "components/Common/AvFieldSelect";

const ChangeType = ({ show, toggle, selectedAcc }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const tradingAccounts = useSelector((state) => state.tradingAccountReducer.accounts.docs);
  const { submitting, error } = useSelector((state) => state.tradingAccountReducer);
  const { accountTypes } = useSelector((state) => state.tradingAccountReducer);

  const [selectedAccount, setSelectedAccount] = useState(tradingAccounts && tradingAccounts[0]);
  const [filteredAccountTypes, setFilteredAccountTypes] = useState([]);
  
  useEffect(() => {
    if (selectedAcc) {
      setSelectedAccount(selectedAcc);
    }
  }, [selectedAcc]);

  // filter accounts based on account's type (live/demo)
  useEffect(() => {
    setFilteredAccountTypes(accountTypes?.filter((at) => at.type === selectedAccount?.type && at.platform === "CTRADER"));
  }, [accountTypes, selectedAccount, selectedAcc]);


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
        {t("Change Type")}
      </button>
      <Modal centered isOpen={show} toggle={toggle}>
        <ModalHeader toggle={toggle} tag="h4">
          {t("Change Account Type")}
        </ModalHeader>
        <ModalBody>
          <AvForm
            onValidSubmit={(e, v) => {
              dispatch(updateType({
                login: selectedAccount.login,
                accountTypeId: v.accountTypeId,
              }));
            }}
          >
            <AvFieldSelect name="account"
              className="form-select mt-1 mb-2"
              label={t("Account Login")}
              value={selectedAccount}
              options={tradingAccounts
                ?.filter((account) => account.type === "LIVE")
                ?.map((account) => ({
                  value: account,
                  label: `${account.login} (${account?.accountTypeId?.title})`,
                }))}
              onChange={(e) => {
                setSelectedAccount(e);
              }}
            >
              {tradingAccounts?.map((account) =>
                <option key={account.login} value={account._id}>{account.login}</option>
              )};
            </AvFieldSelect>
            {(selectedAccount)  &&
            <AvRadioGroup name="accountTypeId" required errorMessage={t("Select Account Type")}>
              <Row className="border rounded-3 p-3">
                <h5>{t("Account Type")}</h5>
                {filteredAccountTypes?.length > 0 && filteredAccountTypes.map((type) =>
                  <Col key={type._id} md="6" className="gy-1">
                    <div className="custom-radio"
                      onClick={() => {
                        document.getElementById(`radio-accountTypeId-${type._id}`).click();
                      }}>
                      <AvRadio label={t(type.title)} value={type._id} />
                    </div>
                  </Col>
                )}
              </Row>
            </AvRadioGroup>}
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

export default ChangeType;