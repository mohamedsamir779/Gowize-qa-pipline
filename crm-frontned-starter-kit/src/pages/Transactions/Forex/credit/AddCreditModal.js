import React, { 
  useState, useEffect, useCallback 
} from "react";
import { useDispatch, connect } from "react-redux";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  UncontrolledAlert,
  Label,
  Row,
  Col
} from "reactstrap";
import { debounce } from "lodash";
import { Link } from "react-router-dom";
import { AvForm, AvField } from "availity-reactstrap-validation";
import "../SearchableInputStyles.scss";
import { withTranslation } from "react-i18next";
import Select from "react-select";
import Loader from "components/Common/Loader";
import { addCredit } from "store/forexTransactions/credit/actions";
import { fetchTradingAccountByLogin } from "store/tradingAccounts/actions";
import AvFieldSelect from "components/Common/AvFieldSelect";
import CustomSelect from "components/Common/CustomSelect";

function AddCreditModal(props){
  const dispatch = useDispatch();
  const { create } = props.withdrawalsPermissions;
  const [addModal, setAddModal] = useState(false);
  const [tradingAccountOwnerName, setTradingAccountOwnerName] = useState();
  const [creditType, setCreditType] = useState();

  useEffect(() => {
    props.show && setAddModal(!addModal);
  }, [props.show]);

  // credit type options
  const creditTypeOptions = [
    {
      label: "Credit In",
      value: "CREDIT_IN"
    },
    {
      label: "Credit Out",
      value: "CREDIT_OUT"
    }
  ];
  
  const toggleAddModal = () => {
    setAddModal(!addModal);
    setTradingAccountOwnerName("");
    props.toggleShow && props.toggleShow();
  };

  useEffect(() => {
    if (!props.addCreditLoading && addModal) {
      setAddModal(false);
      props.toggleShow && props.toggleShow();
    }
  }, [props.addCreditLoading]);

  const handleAddCredit = (e, v) => {
    dispatch(addCredit(v));
  };

  const loadTradingAccounts = (login)=>{
    dispatch(fetchTradingAccountByLogin({ login }));   
  };

  const handleLiveAccountChange = (e) => {
    if (e.target.value != 0){
      loadTradingAccounts(e.target.value);
    }
  };

  useEffect(() => {
    props.accounts && props.accounts?.length != 0
      ?
      setTradingAccountOwnerName(
        props.accounts[0]?.customerId?.firstName + 
        " " +
        props.accounts[0]?.customerId?.lastName 
      )
      :
      setTradingAccountOwnerName("");
  }, [props.fetchTradingAccountsByLoginLoading]);

  // debounce function handlers
  const liveAccountDebounceHandler = useCallback(
    debounce(handleLiveAccountChange, 1000), []
  );
  
  return (
    <React.Fragment >
      <Link to="#" className={`btn btn-primary ${!create ? "d-none" : ""}`} onClick={toggleAddModal}><i className="bx bx-plus me-1"></i> {props.t("Add New Credit")}</Link>
      <Modal isOpen={addModal} toggle={toggleAddModal} centered={true}>
        <ModalHeader toggle={toggleAddModal} tag="h4">
          {props.t("Add New Credit")}
        </ModalHeader>
        <ModalBody >
          <AvForm
            className='p-4'
            onValidSubmit={(e, v) => {
              if (props.customerId) {
                v.customerId = props.customerId;
              } else {
                v.customerId = props.account?.length != 0 && props.accounts[0]?.customerId._id;
                v.tradingAccountId = props.account?.length != 0 && props.accounts[0]?._id;
              }
              v.type = creditType;
              delete v.account;
              delete v.customerName;
              delete v.accountType;
              delete v.liveAccount;
              handleAddCredit(e, v);
            }}
          >
            <Row className="mb-3">
              {!props.customerId ? <Col md="12">
                <AvField
                  name="liveAccount"
                  label={props.t("Live Account")}
                  placeholder={props.t("Enter An Account")}
                  type="text"
                  errorMessage={props.t("Enter A Valid Account")}
                  validate = {{
                    required :{ value:true }
                  }}
                  onChange={(e) => {
                    liveAccountDebounceHandler(e);
                  }}
                  onKeyPress={(e) => {
                    if (!isNaN(e.key) && e.target.value.length > 0){
                      return true;
                    }
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
              </Col>
                : <Col md="12">
                  <AvFieldSelect
                    name="tradingAccountId"
                    label={props.t("Accounts")}
                    required
                    options={props.quickActionAccs
                      ?.filter((account) => account.type === "LIVE")
                      ?.map((account) => ({
                        label: account.login,
                        value: account._id,
                      }))}
                    classNamePrefix="select2-selection"
                    placeholder="Choose an Account"    
                  />
                </Col>}

              {
                props.fetchTradingAccountsByLoginSuccess && 
                props.accounts?.length === 0 &&
                <small className="text-danger">{props.t("Enter A Valid Account")}</small>
              }
              {
                props.fetchTradingAccountsByLoginFail && 
                props.accounts?.length === 0 &&
                <small className="text-danger">
                  {props.fetchTradingAccountsByLoginFailDetails}
                </small>
              }
            </Row>

            {/* customer name */}
            { !props.customerId &&
            <Row className="mb-3">
              <Col md="12">
                <AvField
                  readOnly={true}
                  value={props.accounts && tradingAccountOwnerName}
                  name="customerName"
                  label={props.t("Customer Name")}
                  placeholder={props.t("Customer Name")}
                  type="text"
                  errorMessage={props.t("Enter A Valid Live Account")}
                  validate = {{
                    required :{ value:true }
                  }}
                />
              </Col>
            </Row>}

            {/* amount and credit type*/}
            <Row className="mb-3">
              <Col md="6">
                <AvField
                  name="amount"
                  label={props.t("Amount")}
                  placeholder={props.t("Enter Amount")}
                  type="number"
                  min="1"
                  errorMessage={props.t("Enter Valid Amount")}
                  validate = {{
                    required :{ value:true }
                  }}
                />
              </Col>

              <Col md="6">
                <Label>{props.t("Credit Type")}</Label>
                <div>
                  <CustomSelect 
                    required
                    onChange={(e) => {
                      setCreditType(e.value);
                    }}
                    options={creditTypeOptions}
                    isSearchable = {true}
                    classNamePrefix="select2-selection"
                    placeholder = "Choose An Account"    
                  />
                </div>
              </Col>
            </Row>

            {/* note */}
            <Row className="mb-3">
              <AvField
                name="note"
                label={props.t("Note")}
                placeholder={props.t("Enter Note")}
                type="text"
                errorMessage={props.t("Enter Valid Note")}
              />
            </Row>
    
            <div className='text-center pt-3 p-2'>
              {
                props.addCreditLoading 
                  ?
                  <Loader />
                  :
                  <Button 
                    disabled = {props.addCreditLoading} 
                    type="submit" 
                    color="primary"
                  >
                    {props.t("Add")}
                  </Button>
              }
            </div>
          </AvForm>
          {props.addCreditFailDetails && <UncontrolledAlert color="danger">
            <i className="mdi mdi-block-helper me-2" />
            {props.t(props.addCreditFailDetails)}
          </UncontrolledAlert>}
        </ModalBody> 
      </Modal>
    </React.Fragment>
  );
}
const mapStateToProps = (state) => ({
  withdrawalsPermissions : state.Profile.withdrawalsPermissions || {}, 
  modalClear: state.creditReducer.modalClear,
  disableAddButton : state.creditReducer.disableAddButton,
  addCreditLoading: state.creditReducer.addCreditLoading,
  addCreditFailDetails: state.creditReducer.addCreditFailDetails,
  tradingAccounts: state.tradingAccountReducer.tradingAccounts,
  accounts: state.tradingAccountReducer.loginTradingAccounts,
  quickActionAccs: state.tradingAccountReducer.accounts.docs,
  fetchTradingAccountsByLoginLoading: state.tradingAccountReducer.fetchTradingAccountsByLoginLoading,
  fetchTradingAccountsByLoginSuccess: state.tradingAccountReducer.fetchTradingAccountsByLoginSuccess,
  fetchTradingAccountsByLoginFail: state.tradingAccountReducer.fetchTradingAccountsByLoginFail,
  fetchTradingAccountsByLoginFailDetails: state.tradingAccountReducer.fetchTradingAccountsByLoginFailDetails
});
export default connect(mapStateToProps, null)(withTranslation()(AddCreditModal));