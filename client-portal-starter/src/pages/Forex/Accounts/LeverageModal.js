import { useDispatch, useSelector } from "react-redux";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { 
  Modal, ModalHeader, ModalBody, Button
 } from "reactstrap";
import { withTranslation } from "react-i18next";
import {
  createChangeLeverageRequest,
  getAccountTypesStart,
} from "store/actions";
import Loader from "components/Common/Loader";
import { useEffect, useState } from "react";
import config from "config";

const LeverageModal = ({ isOpen, toggle, accounts, t }) => {
  const dispatch = useDispatch();
  const [selectedAccount, setSelectedAccount] = useState(accounts[0]?._id);
  const [selectedLeverage, setSelectedLeverage] = useState(config.LEVERAGES);
  const createChangeLeverageRequestLoading = useSelector(
    (state) => state.forex.requests.createChangeLeverageRequestLoading
  );
  const handleValidSubmit = (event, values) => {
    dispatch(
      createChangeLeverageRequest({
        _id: values.account,
        to: values.leverage,
        from: values.from,
        login: values.login,
        platform: values.platform,
      })
    );
  };
  const { accountTypes, submitting } = useSelector(
    (state) => state.forex.accounts
  );

  useEffect(() => {
    if (accounts.length > 0) {
      setSelectedAccount(accounts[0]._id);
    }
  }, [accounts]);

  useEffect(() => {
    dispatch(
      getAccountTypesStart({
        forCp: true,
      })
    );
    return () => {
      dispatch(getAccountTypesStart());
    };
  }, []);

  useEffect(() => {
    if (!selectedAccount || !accountTypes.length) return;
  
    const account = accounts.find(acc => acc._id === selectedAccount);
    const type = accountTypes.find(typee => typee._id === account?.accountTypeId._id);
    
    setSelectedLeverage(type?.leverages || config.LEVERAGES);
    
  }, [selectedAccount, accountTypes]);

  return (
    <Modal centered isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle} tag="h4">
        {t("Change Leverage")}
      </ModalHeader>
      <ModalBody>
        <AvForm
          onValidSubmit={(e, v) => {
            v.from = accounts.filter(
              (account) => account._id == v.account
            )[0]?.MarginLeverage;
            v.login = accounts.filter(
              (account) => account._id == v.account
            )[0]?.login;
            v.platform = accounts.filter(
              (account) => account._id == v.account
            )[0]?.platform;
            handleValidSubmit(e, v);
          }}
        >
          <AvField
            type="select"
            name="account"
            value={accounts[0]._id}
            label={t("Select Account")}
            className="form-select mt-1 mb-2"
            required
            onChange={(e) => setSelectedAccount(e.target.value)}
          >
            {accounts.map((account) => (
              <option key={account.login} value={account._id}>
                {account.login}
              </option>
            ))}
            ;
          </AvField>
          <AvField
            type="select"
            name="leverage"
            value={"100"}
            label={t("Select Leverage")}
            className="form-select mt-1"
            required
          >
            {(selectedLeverage || config.LEVERAGES)?.map((leverage) => (
              <option key={leverage} value={leverage}>
                1:{leverage}
              </option>
            ))}
          </AvField>
          <div className="text-center mt-3 mb-1">
            {createChangeLeverageRequestLoading ? (
              <Loader />
            ) : (
              <Button type="submit" className="border-0 color-bg-btn shadow">
                {t("Change")}
              </Button>
            )}
          </div>
        </AvForm>
      </ModalBody>
    </Modal>
  );
};

export default withTranslation()(LeverageModal);
