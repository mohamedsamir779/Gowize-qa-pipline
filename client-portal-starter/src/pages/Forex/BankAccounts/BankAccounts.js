import { deleteBankAccount } from "apis/bankAccounts";
import EditBankAccountModal from "components/BankAccounts/EditBankAccountModal";
import ShowDetails from "components/BankAccounts/ShowDetails";
import CardWrapper from "components/Common/CardWrapper";
import DeleteModal from "components/Common/DeleteModal";
import React, { useState } from "react";  
import { withTranslation } from "react-i18next";
import { MetaTags } from "react-meta-tags";
import { useDispatch, connect } from "react-redux";
import { 
  Button, Col, Container, Row 
} from "reactstrap";
import { toggleCurrentModal } from "store/actions";
import { showSuccessNotification, showErrorNotification } from "store/general/notifications/actions";
import { fetchBankAccounts } from "../../../store/actions";

function BankAccounts(props) {
  const dispatch = useDispatch();
  const {
    t,
    bankAccounts,
  } = props;
  const [showBankModal, setShowBankModal] = useState(false);
  const [updateBankModal, setUpdateBankModal] = useState(false);
  const [selectedBank, setSelectedBank] = useState({});
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedBankId, setSelectedBankId] = useState("");
  
  const handelShow = (accountDetails) => {
    setSelectedBank(accountDetails);
    setShowBankModal(true);
  };
  
  const handelUpdate = (accountDetails) => {
    setSelectedBank(accountDetails);
    setUpdateBankModal(true);
  };
  
  const handelDelete = () => {
    deleteBankAccount(selectedBankId)
      .then(() => {
        dispatch(
          showSuccessNotification("Bank Account Deleted successfully !!!")
        );
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
      });
  };  
  
  return (
    <div className="page-content">
      <MetaTags>
        <title>{t("Bank Accounts")}</title>
      </MetaTags>
      <Container>
        <div className="wallet-page h-100 ">
          {/* <h1 className="m-4">Overview</h1> */}
          <div className="d-flex justify-content-between m-4" >
            <h1 className="color-primary" style={{
              zIndex: 2,
            }}>{t("Bank Accounts")}</h1>
            <Button 
              type="button" 
              className="color-bg-btn border-0 m-2 p-2 btn-sm w-md" 
              style={{
                zIndex: 2,
              }}
              onClick={() => { dispatch(toggleCurrentModal("AddBankAccountModal"))}}
            >
              {t("Add Bank Account")}
            </Button>
          </div>
          {bankAccounts?.length < 1 &&
            <CardWrapper className='mb-3 total-balance p-4 shadow glass-card'>
              <Row className="align-items-center justify-content-between">
                <div className="d-flex align-items-center justify-content-center">
                  <h4 className="color-primary">
                    {"No bank accounts"}
                  </h4>
                </div>
              </Row>
            </CardWrapper>
          }
          {bankAccounts?.map((bankAccount, index) =>
            <CardWrapper key={index} className='mb-3 total-balance p-4 glass-card shadow'>
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
                  <Button type="button" className='border-0 color-bg-btn w-lg' onClick={() => { handelShow(bankAccount) }}>Show</Button>
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

const mapStateToProps = (state) => ({
  loading: state.crypto.bankAccounts.loading,
  bankAccounts: (state.crypto.bankAccounts.bankAccounts.docs),
  error: state.crypto.bankAccounts.error
});

export default connect(mapStateToProps, null)(withTranslation()(BankAccounts)); 