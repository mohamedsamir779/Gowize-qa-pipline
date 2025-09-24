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
import { Link } from "react-router-dom";
import { debounce } from "lodash";
import { AvForm, AvField } from "availity-reactstrap-validation";
import "../SearchableInputStyles.scss";
import { withTranslation } from "react-i18next";
import Select from "react-select";
import { addForexWithdrawal } from "store/forexTransactions/withdrawals/actions";
import Loader from "components/Common/Loader";
import { fetchTradingAccountByLogin } from "store/tradingAccounts/actions";
import { fetchForexWithdrawalsGatewaysStart } from "store/forexGateway/actions";
import AvFieldSelect from "components/Common/AvFieldSelect";
import CustomSelect from "components/Common/CustomSelect";

function AddForexWithdrawalModal(props){
  const dispatch = useDispatch();
  const { create } = props.withdrawalsPermissions;
  const [addModal, setAddModal] = useState(false);
  const [gateway, setGateway] = useState("");
  const [accountType, setAccuntType] = useState("");
  const [tradingAccountOwnerName, setTradingAccountOwnerName] = useState();
  useEffect(() => {
    props.show && setAddModal(true);
  }, [props.show]);

  useEffect(() => {
    if (props.customerId) {
      dispatch(fetchForexWithdrawalsGatewaysStart());
    }
  }, []);


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
  
  const toggleAddModal = () => {
    setAddModal(!addModal);
    setTradingAccountOwnerName("");
    props.toggleShow && props.toggleShow();
  };

  useEffect(() => {
    if (!props.withdrawalAddLoading && addModal) {
      setAddModal(false);
      props.toggleShow && props.toggleShow();
    }
  }, [props.withdrawalAddLoading]);

  const handleAddForexDeposit = (e, v) => {
    dispatch(addForexWithdrawal(v));
  };

  const loadTradingAccounts = (login)=>{
    dispatch(fetchTradingAccountByLogin({ logins: [login] }));   
  };

  const handleLiveAccountChange = (e) => {
    if (e.target.value != 0){
      loadTradingAccounts(e.target.value);
    }
  };

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
  }, [props.fetchTradingAccountsByLoginLoading, accountType]);

  // debounce function handlers
  const liveAccountDebounceHandler = useCallback(
    debounce(handleLiveAccountChange, 1000), []
  );
  
  return (
    <React.Fragment >
      <Link to="#" className={`btn btn-primary ${!create ? "d-none" : ""}`} onClick={toggleAddModal}><i className="bx bx-plus me-1"></i> {props.t("Add New Withdrawal")}</Link>
      <Modal isOpen={addModal} toggle={toggleAddModal} centered={true}>
        <ModalHeader toggle={toggleAddModal} tag="h4">
          {props.t("Add New Withdrawal")}
        </ModalHeader>
        <ModalBody >
          <AvForm
            className='p-4'
            onValidSubmit={(e, v) => {
              v.gateway = gateway;
              if (props.customerId) {
                v.customerId = props.customerId;
              } else {
                v.customerId = props.account?.length != 0 && props.accounts[0]?.customerId._id;
                v.tradingAccountId = props.account?.length != 0 && props.accounts[0]?._id;
                delete v.account;
                delete v.customerName;
              }
              delete v.accountType;
              handleAddForexDeposit(e, v);
            }}
          >
            <Row>
              <Col md="12">
                <Label>{props.t("Account Type")}</Label>
                <div>
                  <CustomSelect 
                    required
                    onChange={(e) => {
                      setAccuntType(e.value);
                    }}
                    isSearchable = {true}
                    options={accountTypeOptions}
                    classNamePrefix="select2-selection"
                    placeholder = "Choose An Account Type"    
                  />
                  <AvField
                    name="accountType"
                    type="text"
                    errorMessage={props.t("Choose An Account Type")}
                    validate={{ required: { value: true } }}
                    value={accountType}
                    style={{
                      opacity: 0,
                      height: 0,
                      width: 0,
                      margin: -10
                    }}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              {!props.customerId ? <Col md="12">
                <AvField
                  name="account"
                  label={props.t("Account")}
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
                {
                  props.fetchTradingAccountsByLoginSuccess && 
                  props.accounts?.length === 0 &&
                  <small className="text-danger">{props.t("Enter A Valid Account")}</small>
                }
                {
                  props.accounts && props.accounts[0]?.type == "IB" && accountType == "LIVE" && 
                  <small className="text-danger">{props.t("Enter A Valid Account")}</small>
                }
                {
                  props.accounts && props.accounts[0]?.type == "LIVE" && accountType == "IB" && 
                  <small className="text-danger">{props.t("Enter A Valid Account")}</small>
                }
                {
                  props.fetchTradingAccountsByLoginFail && 
                  props.accounts?.length === 0 &&
                  <small className="text-danger">
                    {props.fetchTradingAccountsByLoginFailDetails}
                  </small>
                }
              </Col>
                : <Col md="12">
                  <AvFieldSelect
                    name="tradingAccountId"
                    label={props.t("Accounts")}
                    required
                    options={props.quickActionAccs
                      ?.filter((account) => account.type === accountType)
                      ?.map((account) => ({
                        label: account.login,
                        value: account._id,
                      }))}
                    classNamePrefix="select2-selection"
                    placeholder="Choose an Account"    
                  />
                </Col>}
            </Row>
            { !props.customerId &&
            <Row>
              <Col md="12">
                <AvField
                  readOnly={true}
                  value={props.accounts?.docs?.length != 0 ? tradingAccountOwnerName : ""}
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
            <Row>
              <Col md="12">
                <Label>{props.t("Gateway")}</Label>
                <div>
                  <CustomSelect 
                    required
                    onChange={(e) => {
                      setGateway(e.value.gateway);
                    }}
                    isSearchable = {true}
                    options={Object.keys(props.forexWithdrawalsGateways).map((key) => (
                      {
                        label : `${props.forexWithdrawalsGateways[key]}`,
                        value : {
                          gateway: `${props.forexWithdrawalsGateways[key]}`
                        }
                      }
  
                    ))}
                    classNamePrefix="select2-selection"
                    placeholder = "Choose A Gateway"    
                  />
                  <AvField
                    name="gateway"
                    type="text"
                    errorMessage={props.t("Choose A Gateway")}
                    validate={{ required: { value: true } }}
                    value={gateway}
                    style={{
                      opacity: 0,
                      height: 0,
                      width: 0,
                      margin: -10
                    }}
                  />
                </div>
              </Col>
            </Row>
            <Row>
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
            </Row>
            <Row>
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
                props.withdrawalAddLoading 
                  ?
                  <Loader />
                  :
                  <Button 
                    disabled = {props.withdrawalAddLoading} 
                    type="submit" 
                    color="primary"
                  >
                    {props.t("Add")}
                  </Button>
              }
            </div>
          </AvForm>
          {props.addForexWithdrawalFailDetails && <UncontrolledAlert color="danger">
            <i className="mdi mdi-block-helper me-2" />
            {props.t(props.addForexWithdrawalFailDetails)}
          </UncontrolledAlert>}
        </ModalBody> 
      </Modal>
    </React.Fragment>
  );
}
const mapStateToProps = (state) => ({
  forexWithdrawalsGateways: state.forexGatewayReducer.forexWithdrawalsGateways || [],
  withdrawalsPermissions : state.Profile.withdrawalsPermissions || {}, 
  modalClear: state.forexWithdrawalReducer.modalClear,
  disableAddButton : state.forexWithdrawalReducer.disableAddButton,
  withdrawalAddLoading: state.forexWithdrawalReducer.withdrawalAddLoading,
  addForexWithdrawalFailDetails: state.forexWithdrawalReducer.addForexWithdrawalFailDetails,
  tradingAccounts: state.tradingAccountReducer.tradingAccounts,
  accounts: state.tradingAccountReducer.loginTradingAccounts,
  quickActionAccs: state.tradingAccountReducer.accounts.docs,
  fetchTradingAccountsFail: state.tradingAccountReducer.fetchTradingAccountsFail,
  fetchTradingAccountsByLoginLoading: state.tradingAccountReducer.fetchTradingAccountsByLoginLoading,
  fetchTradingAccountsByLoginSuccess: state.tradingAccountReducer.fetchTradingAccountsByLoginSuccess,
  fetchTradingAccountsByLoginFail: state.tradingAccountReducer.fetchTradingAccountsByLoginFail,
  fetchTradingAccountsByLoginFailDetails: state.tradingAccountReducer.fetchTradingAccountsByLoginFailDetails
});
export default connect(mapStateToProps, null)(withTranslation()(AddForexWithdrawalModal));