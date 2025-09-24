import React, { 
  useState, useEffect, useCallback 
} from "react";
import {
  useDispatch, connect, useSelector 
} from "react-redux";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  UncontrolledAlert,
  Label,
  Row,
  Col,
  Alert
} from "reactstrap";
import { debounce, VERSION } from "lodash";
import { Link } from "react-router-dom";
import { AvForm, AvField } from "availity-reactstrap-validation";
import "../SearchableInputStyles.scss";
import { withTranslation } from "react-i18next";
import Select from "react-select";
import { addInternalTransfer } from "store/forexTransactions/internalTransfers/actions";
import Loader from "components/Common/Loader";
import {
  fetchTradingAccountByLogin, fetchTradingAccountByCustomerId
} from "store/tradingAccounts/actions";
import { fetchClientDetails, fetchReferrals } from "store/client/actions";
import AvFieldSelect from "components/Common/AvFieldSelect";

function AddInternalTransferModal(props){
  const dispatch = useDispatch();
  const { create } = props.withdrawalsPermissions;
  const [addModal, setAddModal] = useState(false);
  const [accountType, setAccountType] = useState("");
  const [tradingAccountOwnerName, setTradingAccountOwnerName] = useState();
  const [fromAccount, setFromAccount] = useState();
  const [fromAccountQuick, setFromAccountQuick] = useState();
  const [transferTo, setTransferTo] = useState("");
  const [toAccOptions, setToAccOptions] = useState([]);

  useEffect(() => {
    setAddModal(!addModal);
  }, [props.show]);


  // account type options
  const accountTypeOptions = [
    {
      label: "Live Account",
      value: "LIVE"
    },
    {
      label: "IB Account (Individual)",
      value: "IB"
    }
  ];

  // transfer to options
  const transferToOptions = [
    {
      label: "Own Account",
      value: "ownAccount"
    },
    {
      label: "Client's Account",
      value: "clientAccount"
    }
  ];

  const toggleAddModal = () => {
    setAddModal(!addModal);
    setTradingAccountOwnerName("");
    setTransferTo("");
    setFromAccount("");
  };
  const initalState = () => {
    setAccountType("");
    setTradingAccountOwnerName("");
    setFromAccount(null);
    setTransferTo(null);
    setToAccOptions([]);
  };

  useEffect(() => {
    if (!props.disableAddButton && open ){
      setAddModal(false);
    }
  }, [props.modalClear]);

  const handleAddForexInternalTransfer = (e, v) => {
    let tradingAccountFrom;
    let type;
    let platform;
    if (props.customerId) {
      tradingAccountFrom = fromAccountQuick._id;
      type = fromAccountQuick.type;
      platform = fromAccountQuick.platform;
    } else {
      tradingAccountFrom = props.tradingAccountsByCustomerId.find(account => account.login == v.tradingAccountFrom)?._id;
      type = props.accounts[0].type;
      platform = props.accounts[0].platform;
    }
    dispatch(addInternalTransfer({
      ...v,
      tradingAccountFrom,
      type,
      platform,
      tradingAccountTo: v.tradingAccountTo._id,
    }));
  };

  const loadTradingAccounts = (login)=>{
    dispatch(fetchTradingAccountByLogin({ login: login }));   
  };

  const loadTradingAccountsByCustomerId = (customerId)=>{
    dispatch(fetchTradingAccountByCustomerId({ customerId }));   
  };

  const handleLiveAccountChange = (e) => {
    if (e.target.value != 0){
      loadTradingAccounts(e.target.value);
    }
  };
  
  useEffect(() => {
    props.accounts &&
    loadTradingAccountsByCustomerId(props.account?.length != 0 && props.accounts[0]?.customerId._id);
  }, [tradingAccountOwnerName]);

  useEffect(() => {
    (props.accounts && props.accounts?.length != 0 && props.accounts[0]?.type == "IB" && accountType == "IB") ||
    (props.accounts && props.accounts?.length != 0 && props.accounts[0]?.type == "LIVE" && accountType == "LIVE")
      ?
      setTradingAccountOwnerName(
        props.accounts[0]?.customerId?.firstName + 
        " " +
        props.accounts[0]?.customerId?.lastName 
      )
      :
      setTradingAccountOwnerName("");
    
    if (props.accounts && !props.customerId){
      
      setFromAccount(props.accounts[0]);
    }
  }, [props.fetchTradingAccountsByLoginLoading, accountType]);

  useEffect(() => {
    if (fromAccountQuick) {
      const options = props.quickActionAccs.filter(account => {
        if (account.platform === fromAccountQuick.platform && account.type === fromAccountQuick.type && account.login !== fromAccountQuick.login) return account;
      });
      setToAccOptions([...options]);
    }
  }, [fromAccountQuick]);
  

  // debounce function handlers
  const liveAccountDebounceHandler = useCallback(
    debounce(handleLiveAccountChange, 1000), []
  );

  const { referrals, fx } = useSelector((state) => state.clientReducer?.clientDetails);

  useEffect(() => {
    if (fromAccount) {
      dispatch(fetchReferrals({
        type: "live",
        clientId: fromAccount.customerId._id
      }));
      dispatch(fetchClientDetails(fromAccount.customerId._id));
    }
  }, [fromAccount]);

  useEffect(() => {
    if (fromAccountQuick) {
      dispatch(fetchReferrals({
        type: "live",
        clientId: fromAccountQuick.customerId._id
      }));
    }
  }, [fromAccountQuick]);

  useEffect(()=>{
    if (accountType === "IB" && (fromAccount?.accountTypeId?.type === "IB" || fromAccountQuick?.accountTypeId?.type === "IB")){
      if (transferTo === "clientAccount"){
        setToAccOptions("");
        referrals[0].childs.map((child, index)=>{
          setToAccOptions((state)=> {
            return [...state, ...child.fx.liveAcc];
          });
        });
      }
      if (transferTo === "ownAccount"){
        setToAccOptions("");
        setToAccOptions((state)=> {
          return [...state, ...fx?.liveAcc];
        });
      }
    }
  }, [transferTo, referrals]);

  return (
    <React.Fragment >
      <Link to="#" className={`btn btn-primary ${!create ? "d-none" : ""}`} onClick={toggleAddModal}>
        <i className="bx bx-plus me-1" /> 
        {props.t("Add New Internal Transfer")}
      </Link>
      <Modal isOpen={addModal} toggle={toggleAddModal} centered={true}>
        <ModalHeader toggle={toggleAddModal} tag="h4">
          {props.t("Add New Internal Transfer")}
        </ModalHeader>
        <ModalBody >
          <AvForm
            className='p-4'
            onValidSubmit={(e, v) => {
              if (props.customerId) {
                v.customerId = props.customerId;
              } else {
                v.customerId = props.account?.length != 0 && props.accounts[0]?.customerId._id;
              }
              v.transferToAccount = transferTo;
              handleAddForexInternalTransfer(e, v);
            }}
          >
            <Row className="mb-3">
              <Col md="12">
                <div>
                  <AvFieldSelect
                    label={props.t("Account Type")}
                    name="accountType"
                    type="select"

                    required
                    onChange={(e) => {
                      setAccountType(e);
                    }}
                    isSearchable = {true}
                    options={accountTypeOptions}
                    classNamePrefix="select2-selection"
                    validate={{ required: { value: true } }}
                  />
                </div>
              </Col>
            </Row>
            <Row className="mb-3">
              {!props.customerId ? <Col md="12">
                <AvField
                  name="tradingAccountFrom"
                  label={props.t("From Account")}
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
              </Col> :
                <Col md="12">
                  <AvFieldSelect 
                    name="tradingAccountFrom"
                    label={props.t("From Accounts")}
                    required
                    options={props.quickActionAccs
                      ?.filter((account) => account.type === accountType)
                      ?.map((account) => ({
                        label: account.login,
                        value: account,
                      }))}
                    onChange={(e) => {
                      console.log(e);
                      setFromAccountQuick(e);
                    }}
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
                props.accounts && props.accounts[0]?.type == "IB" && accountType == "IB" && 
                <small className="text-danger">{props.t("Enter A Valid Account")}</small>
              }
              {/* {
                props.accounts && props.accounts[0]?.type == "LIVE" && accountType == "LIVE" && 
                <small className="text-danger">{props.t("Enter A Valid Account")}{JSON.stringify(props.accounts[0])}</small>
              } */}
              {
                props.fetchTradingAccountsByLoginFail && 
                props.accounts?.length === 0 &&
                <small className="text-danger">
                  {props.fetchTradingAccountsByLoginFailDetails}
                </small>
              }
              {
                props.accounts && props.accounts.length !== 0 && tradingAccountOwnerName !== "" &&
                <Row><Alert className="m-2" color="warning">Balance: {props.accounts[0].Equity}</Alert></Row>
              }
            </Row>
            {!props.customerId
            && <Row className="mb-3">
              <Col md="12">
                <AvField
                  readOnly={true}
                  value={tradingAccountOwnerName}
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
            {accountType === "IB" && 
            <Row className="mb-3">
              <Col md="12">
                <Label>{props.t("Transfer To")}</Label>
                <div>
                  <Select 
                    required
                    onChange={(e) => {
                      setTransferTo(e.value);
                    }}
                    isSearchable = {true}
                    options={transferToOptions}
                    classNamePrefix="select2-selection"
                    placeholder = "Choose An option"    
                  />
                </div>
                <AvField
                  name="gateway"
                  type="text"
                  errorMessage={props.t("Choose A Gateway")}
                  validate={{ required: { value: true } }}
                  value={transferTo}
                  style={{
                    opacity: 0,
                    height: 0,
                    width: 0,
                    margin: -10
                  }}
                />
              </Col>
            </Row>}
            <Row className="mb-3">
              <Col md="12">
                <div>
                  <AvFieldSelect
                    name="tradingAccountTo"
                    label={props.t("To Account")} 
                    required
                    options={toAccOptions?.map((a)=>{
                      console.log({a});
                      return {
                        label: a.login ? `${a.login} | Bal: ${a.Equity ? a.Equity : a?.equity}` : a,
                        value: a
                      };
                    })}
                    isSearchable = {true}
                    classNamePrefix="select2-selection"
                  />
                </div>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md="12">
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
            </Row>
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
                props.addInternalTransferLoading 
                  ?
                  <Loader />
                  :
                  <Button 
                    disabled = {props.addInternalTransferLoading} 
                    type="submit" 
                    color="primary"
                  >
                    {props.t("Add")}
                  </Button>
              }
            </div>
          </AvForm>
          {props.addInternalTransferFail && <UncontrolledAlert color="danger">
            <i className="mdi mdi-block-helper me-2" />
            {props.t(props.addInternalTransferFailDetails)}
          </UncontrolledAlert>}
        </ModalBody> 
      </Modal>
    </React.Fragment>
  );
}
const mapStateToProps = (state) => ({
  withdrawalsPermissions : state.Profile.withdrawalsPermissions || {}, 
  modalClear: state.internalTransferReducer.modalClear,
  disableAddButton : state.internalTransferReducer.disableAddButton,
  addInternalTransferLoading: state.internalTransferReducer.addInternalTransferLoading,
  addInternalTransferFail: state.internalTransferReducer.addInternalTransferFail,
  addInternalTransferFailDetails: state.internalTransferReducer.addInternalTransferFailDetails,
  accounts: state.tradingAccountReducer.loginTradingAccounts,
  quickActionAccs: state.tradingAccountReducer.accounts.docs,
  fetchTradingAccountsByLoginLoading: state.tradingAccountReducer.fetchTradingAccountsByLoginLoading,
  tradingAccountsByCustomerId: state.tradingAccountReducer.customerTradingAccounts,
  fetchTradingAccountsByLoginSuccess: state.tradingAccountReducer.fetchTradingAccountsByLoginSuccess,
  fetchTradingAccountsByLoginFail: state.tradingAccountReducer.fetchTradingAccountsByLoginFail,
  fetchTradingAccountsByLoginFailDetails: state.tradingAccountReducer.fetchTradingAccountsByLoginFailDetails
});
export default connect(mapStateToProps, null)(withTranslation()(AddInternalTransferModal));