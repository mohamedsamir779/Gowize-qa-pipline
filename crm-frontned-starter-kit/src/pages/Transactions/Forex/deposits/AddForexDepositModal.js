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
  Col,
  Input
} from "reactstrap";
import { debounce } from "lodash";
import { Link } from "react-router-dom";
import { AvForm, AvField } from "availity-reactstrap-validation";
import "../SearchableInputStyles.scss";
import { withTranslation } from "react-i18next";
import Select from "react-select";
import { addForexDeposit } from "store/forexTransactions/deposits/actions";
import Loader from "components/Common/Loader";
import { fetchTradingAccountByLogin } from "store/tradingAccounts/actions";
import AvFieldSelect from "components/Common/AvFieldSelect";
import { fetchForexDepositsGatewaysStart } from "store/forexGateway/actions";
import CustomSelect from "components/Common/CustomSelect";

function AddForexDepositModal(props){
  const dispatch = useDispatch();
  const { create } = props.depositsPermissions;
  const [addModal, setDepositModal] = useState(false);
  const [memFiles, setMemFiles] = useState({});
  const [imageError, setImageError] = useState();
  const [gateway, setGateway] = useState("");
  const [tradingAccountOwnerName, setTradingAccountOwnerName] = useState();
  useEffect(() => {
    setDepositModal(!addModal);
  }, [props.show]);

  useEffect(() => {
    if (props.customerId) {
      dispatch(fetchForexDepositsGatewaysStart());
    }
  }, []);

  // max file size to uplaod = 5 MB
  const maxFileSize = 5;
  const acceptedExtensions = ["image/jpeg", "image/png", "application/pdf"];
  const fileSizeError = "File is too large, It has to be 5MB at most";
  const fileExtensionError = "Only accepts files with the following extensions *jpg, *png, *pdf";

  const addFile = (name, files) => {
    // clear previous error
    setImageError("");

    // check file extension
    if (!acceptedExtensions.includes(files?.type)){
      setImageError(fileExtensionError);
    }

    // check file size
    if ((files?.size / 1000000) > maxFileSize){
      setImageError(fileSizeError);
    }

    // otherwise it's all good 
    if ((files?.size / 1000000) <= maxFileSize){
      setMemFiles({
        ...memFiles,
        [name]: files,
      });
    }
  };
  
  const toggleAddModal = () => {
    setDepositModal(!addModal);
    setImageError("");
    setTradingAccountOwnerName("");
  };

  const handleAddForexDeposit = (e, v) => {
    dispatch(addForexDeposit(v));
  };

  const loadTradingAccounts = (login)=>{
    dispatch(fetchTradingAccountByLogin({ logins: [login] }));   
  };

  const handleLiveAccountChange = (e) => {
    if (e.target.value != 0){
      loadTradingAccounts(e.target.value);
    }
  };

  // debounce function handlers
  const liveAccountDebounceHandler = useCallback(
    debounce(handleLiveAccountChange, 1000), []
  );

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

  useEffect(() => {
    if (!props.disableAddButton && open ){
      setDepositModal(false);
    }
  }, [props.modalClear]);

  return (
    <React.Fragment >
      <Link to="#" className={`btn btn-primary ${!create ? "d-none" : ""}`} onClick={toggleAddModal}><i className="bx bx-plus me-1"></i> {props.t("Add New Deposit")}</Link>
      <Modal isOpen={addModal} toggle={toggleAddModal} centered={true}>
        <ModalHeader toggle={toggleAddModal} tag="h4">
          {props.t("Add New Deposit")}
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
                delete v.liveAccount;
                delete v.customerName;
              }
              v.gateway = gateway;
              // v.image = memFiles;
              handleAddForexDeposit(e, v);
            }}
          >
            <Row className="mb-3">
              {!props.customerId ? <Col md="12">
                <AvField
                  name="liveAccount"
                  label={props.t("Live Account")}
                  placeholder={props.t("Enter Live Account")}
                  type="text"
                  errorMessage={props.t("Enter Valid Live Account")}
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
                  }}
                />
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
            </Row>

            {/* customer name */}
            { !props.customerId
            && <Row className="mb-3">
              <Col md="6">
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

            {/* gateway */}
            <Row className="mb-3">
              <Col md="12">
                <Label>{props.t("Gateway")}</Label>
                <div>
                  <CustomSelect 
                    required
                    loading={props.depositsGatewaysLoading}
                    onChange={(e) => {
                      setGateway(e.value.gateway);
                    }}
                    isSearchable = {true}
                    options={Object.keys(props.forexDepositsGateways).map((key) => (
                      {
                        label : `${props.forexDepositsGateways[key]}`,
                        value : {
                          gateway: `${props.forexDepositsGateways[key]}`
                        }
                      }
  
                    ))}
                    classNamePrefix="select2-selection"
                    placeholder = "Choose A Gateway"    
                  />
                </div>
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
              </Col>
            </Row>

            {/* amount and image */}
            <Row className="mb-3">
              {/* amount */}
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

              {/* image */}
              <Col md="6">
                <Label>{props.t("Image")}</Label>
                <Input
                  type="file"
                  className="form-control form-control-md"
                  id="image"
                  onChange={(e) => {
                    addFile("IMAGE", e.target.files[0]);
                  }}
                  name="image"
                  invalid={imageError}
                />
                {
                  imageError && <small className="text-danger">{imageError}</small>
                }
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
                props.addLoading 
                  ?
                  <Loader />
                  :
                  <Button 
                    disabled = {props.addLoading} 
                    type="submit" 
                    color="primary"
                  >
                    {props.t("Add")}
                  </Button>
              }
            </div>
          </AvForm>
          {props.addForexDepositFailDetails && <UncontrolledAlert color="danger">
            <i className="mdi mdi-block-helper me-2" />
            {props.t(props.addForexDepositFailDetails)}
          </UncontrolledAlert>}
        </ModalBody> 
      </Modal>
    </React.Fragment>
  );
}
const mapStateToProps = (state) => ({
  forexDepositsGateways: state.forexGatewayReducer.forexDepositsGateways || [],
  depositsGatewaysLoading: state.forexGatewayReducer.depositsGatewaysLoading || [],
  modalClear: state.forexDepositReducer.modalClear,
  depositsPermissions : state.Profile.depositsPermissions || {}, 
  disableAddButton : state.forexDepositReducer.disableAddButton,
  addLoading: state.forexDepositReducer.addLoading,
  addForexDepositFailDetails: state.forexDepositReducer.addForexDepositFailDetails,
  tradingAccounts: state.tradingAccountReducer.tradingAccounts,
  accounts: state.tradingAccountReducer.loginTradingAccounts,
  quickActionAccs: state.tradingAccountReducer.accounts.docs,
  fetchTradingAccountsFail: state.tradingAccountReducer.fetchTradingAccountsFail,
  fetchTradingAccountsByLoginLoading: state.tradingAccountReducer.fetchTradingAccountsByLoginLoading,
  fetchTradingAccountsByLoginSuccess: state.tradingAccountReducer.fetchTradingAccountsByLoginSuccess,
  fetchTradingAccountsByLoginFail: state.tradingAccountReducer.fetchTradingAccountsByLoginFail,
  fetchTradingAccountsByLoginFailDetails: state.tradingAccountReducer.fetchTradingAccountsByLoginFailDetails
});
export default connect(mapStateToProps, null)(withTranslation()(AddForexDepositModal));