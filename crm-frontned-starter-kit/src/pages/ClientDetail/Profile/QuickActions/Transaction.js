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
import React, { useState, useEffect } from "react";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { fetchGatewaysStart } from "store/gateway/action";
import { addDepositStart, fetchDepositsStart } from "store/transactions/deposit/action";
import { fetchWalletStart, clearWallets } from "store/wallet/list/action";
import { fetchClientsStart } from "store/client/actions";
import { withTranslation } from "react-i18next";
import Select from "react-select";
import transactions from "common/data/transactions";
import { makeWithdrawalStart, fetchWithdrawalsStart } from "store/transactions/withdrawal/action";

function TransactionForm(props){
  const [transactionModal, setTransactionModal] = useState(false);
  const [type, setType] = useState("");
  const [selectedWalletId, setSelectedWalletId] = useState("");
  const [gateway, setGateway] = useState("");
  const dispatch = useDispatch();
  const handleTransaction = (event, values) => {
    delete values.type;
    event.preventDefault();
    if (type == "Deposit"){
      dispatch(addDepositStart({
        customerId: props.clientId,
        walletId: selectedWalletId,
        gateway,
        ...values
      }));
      dispatch(clearWallets());
    }
    else if (type === "Withdrawal"){
      dispatch(makeWithdrawalStart({
        customerId: props.clientId,
        walletId:selectedWalletId,
        gateway,
        ...values
      }));
      dispatch(clearWallets());
    }
  
  }; 
  
  const toggleAddModal = () => {
    if (!transactionModal) {
      fetchData();
    }
    setTransactionModal(!transactionModal);
  };

  useEffect(() => {
    if (props.modalClear && transactionModal ){
      setTransactionModal(false);
    }
   
  }, [props.modalClear]);

  useEffect(()=>{
    if (props.withdrawalModalClear && transactionModal){
      setTransactionModal(false);
    }
  }, [props.withdrawalModalClear]);
  
  const fetchData = () => {
    dispatch(fetchWalletStart({
      belongsTo: props.clientId
    }));
    dispatch(fetchGatewaysStart());  
  };
  
  return (
    <React.Fragment >
      <button 
        type="button"
        disabled={props.isLead}
        className="btn btn-primary waves-effect waves-light w-100 me-1"
        onClick={toggleAddModal}
      >
        {props.t("Add Transaction")}
      </button>
      {/* <Link to="#" className={`btn btn-primary ${!create ? "d-none" : ""}`} onClick={toggleAddModal}><i className="bx me-1"></i> {props.t("Add Transaction")}</Link> */}
      <Modal isOpen={transactionModal} toggle={toggleAddModal} centered={true}>
        <ModalHeader toggle={toggleAddModal} tag="h4">
          {props.t("Make Transaction")}
        </ModalHeader>
        <ModalBody >
    
          <AvForm
            className='p-4'
            onValidSubmit={(e, v) => {
              handleTransaction(e, v);
            }}
          >
            <Row className="mb-3">
              <Col md="12">
                <Label>{props.t("Type")}</Label>
                <Select
                  name="type" 
                  label="Type"
                  options= {transactions.map(transaction=>{
                    return {
                      label:transaction,
                      value:transaction
                    };
                  }
                  )}

                  onChange = {(e)=>setType(e.value)}
                />
              </Col>
              <Col className="mt-2" md="12">
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
                    classNamePrefix="select2-selection"
                    placeholder = "choose your wallet"
                      
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
                  placeholder = "choose a gateway"
                      
                />
              </div>
            </div>
              
               
            <div className="mb-3">
              <AvField
                name="amount"
                label={props.t("Amount")}
                placeholder={props.t("enter amount")}
                type="number"
                errorMessage={props.t("Enter Valid Amount")}
                validate = {{
                  required :{ value:true },
                  pattern : {
                    // eslint-disable-next-line no-useless-escape
                    value :"^[0-9]+(\\.([0-9]{1,4}))?$",
                    errorMessage : "Amount is not valid"
                  }
                }}
              />
            </div>
            <div className="mb-3">
              <AvField
                name="note"
                label={props.t("Note")}
                placeholder={props.t("enter note")}
                type="text"
                errorMessage={props.t("Enter Valid Note")}
                validate={{ 
                  required: { value: true },
                  
                }}
              />
            </div>
    
            <div className='text-center pt-3 p-2'>
              <Button disabled = {props.disableAddButton || props.disableWithdrawalButton} type="submit" color="primary" className="">
                {props.t("Add")}
              </Button>
            </div>
          </AvForm>
          { props.depositError && <UncontrolledAlert color="danger">
            <i className="mdi mdi-block-helper me-2"></i>
            {props.t(props.depositError)}
          </UncontrolledAlert>}
          { props.error && <UncontrolledAlert color="danger">
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
  wallets:state.walletReducer.wallets || [],
  depositsPermissions : state.Profile.depositsPermissions || {}, 
  disableAddButton : state.depositReducer.disableAddButton,
  withdrawalModalClear : state.withdrawalReducer.withdrawalModalClear,
  error: state.withdrawalReducer.error,
  depositError:state.depositReducer.depositError,
  disableWithdrawalButton: state.withdrawalReducer.disableWithdrawalButton
});
export default connect(mapStateToProps, null)(withTranslation()(TransactionForm));