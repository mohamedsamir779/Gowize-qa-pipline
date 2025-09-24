import React, { useEffect, useState } from "react"; 
import CardWrapper from "../../../components/Common/CardWrapper";
import {
  Button, Col, Container, Row
} from "reactstrap";
import MetaTags from "react-meta-tags";
// i18n
import { withTranslation } from "react-i18next"; 
import { useDispatch, useSelector } from "react-redux";
import { fetchBankAccounts, toggleCurrentModal } from "../../../store/actions";
import ShowDetails from "components/BankAccounts/ShowDetails";
import EditBankAccountModal from "components/BankAccounts/EditBankAccountModal";
import { deleteBankAccount } from "apis/bankAccounts";
import { showErrorNotification, showSuccessNotification } from "store/general/notifications/actions";
import DeleteModal from "components/Common/DeleteModal";

function BankAccounts(props) {
  const dispatch = useDispatch();

  const bankAccounts = useSelector(
    (state) => state.crypto.bankAccounts?.bankAccounts?.docs
  );
  const [showBankModal, setShowBankModal] = useState(false);
  const [updateBankModal, setUpdateBankModal] = useState(false);
  const [selectedBank, setSelectedBank] = useState({});
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedBankId, setSelectedBankId] = useState("");

  useEffect(() => {
    dispatch(
      fetchBankAccounts({
        limit: 100,
        page: 1,
      })
    );
  }, []);
  const handelShow = (accountDetile) => {
    setSelectedBank(accountDetile);
    setShowBankModal(true);
  };
  const handelUpdate = (accountDetile) => {
    setSelectedBank(accountDetile);
    setUpdateBankModal(true);
  };
  const handelDelete = () => {
    deleteBankAccount(selectedBankId)
      .then(() => {
        dispatch(showSuccessNotification("Bank Account Deleted successfully !!!"));
        dispatch(
          fetchBankAccounts({
            limit: 100,
            page: 1,
          })
        );
        setDeleteModal(false);
      })
      .catch((e) => {
        dispatch(showErrorNotification(e.toString()));
        setDeleteModal(false);
      });
  };
  return (
    <div className="page-content">
      <MetaTags>
        <title>{props.t("Bank Accounts")}</title>
      </MetaTags>
      <Container>
        <div className="wallet-page h-100">
          {/* <h1 className="m-4">Overview</h1> */}
          <div className="d-flex justify-content-between m-4">
            <h1 className="">{props.t("Bank Accounts")}</h1>
            <Button 
              type="button" 
              className="btn btn-secondary m-2 btn-sm w-md" 
              onClick={() => { dispatch(toggleCurrentModal("AddBankAccountModal"))}}
            >
              Add Bank Account
            </Button>
          </div>
          {
            bankAccounts?.length === 0 &&
            <CardWrapper className='mb-3 total-balance p-4 shadow glass-card'>
              <Row className="align-items-center justify-content-between">
                <div className="d-flex align-items-center justify-content-center">
                  <h4>
                    {"No bank accounts"}
                  </h4>
                </div>
              </Row>
            </CardWrapper>
          }
          {bankAccounts?.map((bankAccount, index) =>
            <CardWrapper key={index} className='mb-3 total-balance p-4'>
              <Row className="align-items-center justify-content-between">
                <Col lg={2}>
                  <div className="wallets__total">
                    <div className="wallets__title h6">{bankAccount.bankName}</div>
                    <div className="total-balance-container">
                      <div className="  h4">{bankAccount.accountHolderName}</div>
                    </div>
                    <div className="balance-price"> {bankAccount.accountNumber}</div>
                  </div>
                </Col>
                <Col lg={7} className="wallet-btns">
                  <Button type="button" className='blue-gradient-color w-lg' onClick={() => { handelShow(bankAccount) }}>Show</Button>
                  <Button type="button" className='btn-success w-lg' onClick={() => { handelUpdate(bankAccount) }}>Edit</Button>
                  <Button type="button" className='btn-danger w-lg ' onClick={() => { setDeleteModal(true); setSelectedBankId(bankAccount._id) }}>Delete</Button>
                </Col>
              </Row>
            </CardWrapper>
          )}
        </div>
      </Container>
      <ShowDetails
        isOpen={showBankModal}
        toggleOpen={() => {
          setShowBankModal(false);
        }}
        BankAccountData={selectedBank}
      ></ShowDetails>
      <EditBankAccountModal
        isOpen={updateBankModal}
        toggleOpen={() => {
          setUpdateBankModal(false);
        }}
        BankAccountData={selectedBank}
      ></EditBankAccountModal>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handelDelete}
        onCloseClick={() => setDeleteModal(false)}
      />
    </div>
  );
}

export default withTranslation()(BankAccounts); 