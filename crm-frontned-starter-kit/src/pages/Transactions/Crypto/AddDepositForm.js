import React, {
  useState,
  useEffect,
  useCallback,
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
import { AvForm, AvField } from "availity-reactstrap-validation";
import { fetchGatewaysStart } from "store/gateway/action";
import { addDepositStart } from "store/transactions/deposit/action";
import { fetchWalletStart, clearWallets } from "store/wallet/list/action";
import { fetchClientsStart } from "store/client/actions";
import "./SearchableInputStyles.scss";
import { withTranslation } from "react-i18next";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import Loader from "components/Common/Loader";
import * as clientApi from "apis/client";
import { debounce } from "lodash";

function DepositForm(props){
  const [addModal, setDepositModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedWalletId, setSelectedWalletId] = useState("");
  const [gateway, setGateway] = useState("");
  const [type, setType] = useState("LIVE");
  const dispatch = useDispatch();
  const { create } = props.depositsPermissions;
  const [searchInput, setSearchInput]  = useState("");

  const handleAddDeposit = (event, values) => {
    event.preventDefault();
    dispatch(addDepositStart({
      customerId:selectedClient,
      walletId: selectedWalletId,
      type,
      gateway,
      ...values
    }));
    setSearchInput("");
    dispatch(clearWallets());
  }; 
  
  const toggleAddModal = () => {
    setDepositModal(!addModal);
  };
  useEffect(()=>{
    dispatch(fetchClientsStart({
      page:1,
      type
    }));
    dispatch(fetchGatewaysStart());
    if (searchInput.length >= 3){
      dispatch(fetchClientsStart({
        searchText:searchInput,
        type
      }));
    }
  
  }, [searchInput, type]);

  const debouncedChangeHandler = useCallback(
    debounce((inputValue, cb) => {
      clientApi.getClients({
        payload: {
          searchText: inputValue,
          type: "LIVE"
        }
      }).then((data) => {
        return cb(data?.result?.docs.map((item) => (
          {
            label : `${item.firstName} ${item.lastName}`,
            value : {
              name: `${item.firstName} ${item.lastName}`,
              id: `${item._id}`
            }
          }
        )));
      });
    }, 1000), []
  );

  useEffect(() => {
    if (!props.disableAddButton && open ){
      setDepositModal(false);
    }
  }, [props.modalClear]);
  
  const selectClient = (id)=>{
    setSelectedClient(id);
    dispatch(fetchWalletStart({
      belongsTo:id,
      customerId:id,
    }));
  };

  const selectType = (type)=>{
    setType(type);
    if (selectedClient.length > 0)
      dispatch(fetchWalletStart({
        belongsTo:selectedClient,
        customerId:selectedClient,
      }));
  };

  const validateBiggerThanZero = (value, ctx, input, cb) =>{
    if (value == 0){
      cb("Should be bigger than 0");
    } else
      cb(true);
  };

  return (
    <React.Fragment >
      <Link to="#" className={`btn btn-primary ${!create ? "d-none" : ""}`} onClick={toggleAddModal}><i className="bx bx-plus me-1"></i> {props.t("Add New Deposit")}</Link>
      <Modal isOpen={addModal} toggle={toggleAddModal} centered={true}>
        <ModalHeader toggle={toggleAddModal} tag="h4">
          {props.t("Add Deposit")}
        </ModalHeader>
        <ModalBody >
          <AvForm
            className='px-4 py-2'
            onValidSubmit={(e, v) => {
              delete v.client;
              delete v.clientId;
              delete v.wallet;
              delete v.gateway;
              handleAddDeposit(e, v);
            }}
          >
            <Row className="mb-3">
              <Col md="6">                      
                <Label>{props.t("Client")}</Label>
                <div>
                  <AsyncSelect
                    isClearable
                    placeholder = {props.t("Choose A Client")}
                    defaultOptions={props.loading ? [] : props.clients.map((item) => (
                      {
                        label : `${item.firstName} ${item.lastName}`,
                        value : {
                          name: `${item.firstName} ${item.lastName}`,
                          id: `${item._id}`
                        }
                      }
                    ))}
                    classNamePrefix="select2-selection"
                    loadOptions={debouncedChangeHandler}
                    onChange={(e) => { 
                      if (e && e.value && e.value.id) {
                        selectClient(e.value.id);
                      }
                    }}
                    isRequired={true}
                    isSearchable={true}
                    backspaceRemoves={true}
                    name="clientId"
                  />
                  {/* <Select 
                    onChange={(e) => { 
                      selectClient(e.value.id);
                    }}
                    isSearchable = {true}
                    options={props.loading ? [] : props.clients.map((item) => (
                      {
                        label : `${item.firstName} ${item.lastName}`,
                        value : {
                          name: `${item.firstName} ${item.lastName}`,
                          id: `${item._id}`
                        }
                      }
                    ))}
                    classNamePrefix="select2-selection"
                    placeholder = {props.t("Choose A Client")}
                    name = "clientId"
                    isRequired = {true}
                    isLoading={props.loading}
                  /> */}
                  <AvField
                    name="clientId"
                    type="text"
                    errorMessage={props.t("Choose A Client")}
                    validate={{ required: { value: true } }}
                    value={selectedClient}
                    style={{
                      opacity: 0,
                      height: 0,
                      width: 0,
                      margin: -10
                    }}
                  />
                </div>
              </Col>
              <Col md="6">
                <Label>{props.t("Type")}</Label> 
                <div>
                  <Select 
                    defaultValue={{
                      label:"Live",
                      value:"LIVE" 
                    }}
                    onChange={(e) => {
                      selectType(e.value);   
                    }}
                    options={[{
                      label:"Live",
                      value:"LIVE" 
                    },
                    {
                      label:"Demo",
                      value:"DEMO"
                    }]}
                    classNamePrefix="select2-selection"
                    placeholder = {props.t("Choose Deposit Type")}
                  />
                </div>
              </Col>

              <Col md="12" className="mt-3">
                <Label>{props.t("Wallet")}</Label>
                <div>
                  <Select 
                    onChange={(e) => {
                      setSelectedWalletId(e.value.id);
                      
                    }}
                    isSearchable = {true}
                    options={props.wallets.map((wallet) => (
                      {
                        label : `${wallet.asset}-(Balance ${wallet.amount} ${wallet.asset})`,
                        value : {
                          id: `${wallet._id}`
                        }
                      }

                    ))}
                    name="wallet"
                    classNamePrefix="select2-selection"
                    placeholder={props.t("Choose A Wallet")}
                  />
                  <AvField
                    name="wallet"
                    type="text"
                    errorMessage={props.t("Choose A Wallet")}
                    validate={{ required: { value: true } }}
                    value={selectedWalletId}
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
          
        
            <div className="mb-3">
              <Label>{props.t("Gateway")}</Label>
              <div>
                <Select 
                  onChange={(e) => {
                    setGateway(e.value.gateway);
                  }}
                  isSearchable = {true}
                  options={Object.keys(props.gateways).map((key) => (
                    {
                      label : `${props.gateways[key]}`,
                      value : {
                        gateway: `${props.gateways[key]}`
                      }
                    }

                  ))}
                  classNamePrefix="select2-selection"
                  placeholder={props.t("Choose A Gateway")}    
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
            </div>
               
            <div className="mb-3">
              <AvField
                name="amount"
                label={props.t("Amount")}
                placeholder={props.t("Enter An Amount")}
                type="number"
                min="1"
                errorMessage={props.t("Enter Valid Amount")}
                validate = {{
                  required :{ value:true },
                  pattern : {
                    // eslint-disable-next-line no-useless-escape
                    value :"^[0-9]+(\\.([0-9]{1,4}))?$",
                    errorMessage : "Amount is not valid"
                  },
                  custom:validateBiggerThanZero
                }}
              />
            </div>

            <div className="mb-3">
              <AvField
                name="note"
                label={props.t("Note")}
                placeholder={props.t("Enter Note")}
                type="text"
              />
            </div>
    
            <div className='text-center mt-3 p-2'>
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
          {props.error && <UncontrolledAlert color="danger">
            <i className="mdi mdi-block-helper me-2"></i>
            {props.t(props.error)}
          </UncontrolledAlert>}
        </ModalBody> 
      </Modal>
    </React.Fragment>
  );
}
const mapStateToProps = (state) => ({
  gateways:state.gatewayReducer.gateways || [],
  modalClear:state.depositReducer.modalClear,
  depositResponseMessage:state.depositReducer.depositResponseMessage,
  clients:state.clientReducer.clients || [],
  wallets:state.walletReducer.wallet.wallets || [],
  depositsPermissions : state.Profile.depositsPermissions || {}, 
  disableAddButton : state.depositReducer.disableAddButton,
  addLoading: state.depositReducer.addLoading
});
export default connect(mapStateToProps, null)(withTranslation()(DepositForm));