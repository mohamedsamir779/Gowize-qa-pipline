import React, { useState } from "react";
import {
  Modal,
  Button,
  ModalHeader,
  ModalBody,
  Label,
  UncontrolledAlert
} from "reactstrap";
import { useDispatch, connect } from "react-redux";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { fetchClientWallets, convertWalletStart } from "store/wallet/list/action";
import { fetchAssetsStart } from "store/assests/actions";
import Select, { components } from "react-select";
const { Option } = components;

function ConvertWallet(props) {
  const [addModal, setAddModal] = useState(false);
  const [toAsset, setToAsset] = useState("");
  const [fromAsset, setFromAsset] = useState("");
  const [toAssetId, setToAssetId ] = useState("");
  const [fromAssetId, setFromAssetId] = useState("");
  const { clientId } = props;
  const dispatch = useDispatch();
  
  const toggleAddModal = ()=>{
    if (!addModal) {
      fetchData();
    }
    setAddModal(!addModal);
  };

  const handleConvertWallet = (e, v)=>{
    dispatch(convertWalletStart({
      toAsset,
      fromAsset,
      fromAssetId,
      toAssetId,
      amount: v.amount,
      customerId: clientId,
    }));
  };

  // useEffect(()=>{
  //   dispatch(fetchClientWallets(clientId));
  //   dispatch(fetchAssetsStart({
  //     page:1,
  //     limit:1000
  //   }));
  // }, []);
  const fetchData = () => {
    dispatch(fetchClientWallets(clientId));
    dispatch(fetchAssetsStart({
      page:1,
      limit:1000
    }));
  };

  const validateAmount = (value, ctx, input, cb)=>{
    if (!value){
      cb("Amount is required");
    }
    if (isNaN(value)){
      cb("Amount should be valid number");
    }
    cb(true);
  };

  const CustomOption = (props) => (
    <Option {...props}>
      {props.data.label}
    </Option>
  );

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      display: state.isDisabled ? "none" : "flex",
    }),
  };

  return (
    <React.Fragment>
      <button 
        type="button" 
        disabled={props.isLead}
        className="btn btn-primary waves-effect waves-light w-100 me-1"
        onClick={toggleAddModal}
      >
        Convert
      </button>
      <Modal isOpen={addModal} toggle={toggleAddModal} centered={true}>
        <ModalHeader toggle={toggleAddModal} tag="h4">
            Convert
        </ModalHeader>
        <ModalBody>
          <AvForm
            className="p-4"
            onValidSubmit={ (e, v) => {
              handleConvertWallet(e, v);
            }}
          >
            <Label>From Asset</Label>
            <Select
              type="text" 
              label = "From Asset"
              name="fromAsset"
              placeholder="Select From Wallet"
              isOptionDisabled={(option) => option.value.asset == toAsset}
              styles={customStyles}
              components={{ Option: CustomOption }}
              options = {props.docs && props.docs.map((wallet)=>{
                return {
                  label:`${wallet.asset} (${wallet.amount})`,
                  value:{
                    id:wallet._id,
                    asset:wallet.asset
                  }
                };
              })}
              onChange= {e=>{
                setFromAsset(e.value.asset);
                setFromAssetId(e.value.id);
              }}
            />
            <div className="mt-2">
              <Label>To Asset</Label>
              <Select 
                placehoder = "Select to asset"
                type="text" 
                label="To Asset" 
                name="toAsset"
                placeholder="Select To Wallet"
                isOptionDisabled={(option) => option.value.asset == fromAsset}
                styles={customStyles}
                components={{ Option: CustomOption }}
                options = {props.docs && props.docs.map(wallet=>{
                  return {
                    label:`${wallet.asset} (${wallet.amount})`,
                    value: {
                      id:wallet._id, 
                      asset:wallet.asset
                    }
                  };     

                })}
                onChange={e=>{
                  setToAssetId(e.value.id);
                  setToAsset(e.value.asset);
                }}
              />
            </div>
            <div className="mt-2">
              <AvField 
                label="Amount"
                name="amount"
                type="text"
                placeholder="Enter Amount"
                validate={{ custom:validateAmount }}
                onKeyPress={(e)=>{
                  if (e.key == ".")
                    return true;
                  if (!/[0-9]/.test(e.key))
                    e.preventDefault();
                }}
              />
            </div>
           
            <div className="mt-2 text-center">
              <Button color="primary">Convert Wallet</Button>
            </div>
           
          </AvForm>
          {props.convertWalletError && <UncontrolledAlert color="danger">
            <i className="mdi mdi-block-helper me-2"></i>
            {props.convertWalletError}
          </UncontrolledAlert>}
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
}
const mapStateToProps = (state)=>({
  docs: state.walletReducer.docs || [],
  assets: state.assetReducer.assets || [],
  convertWalletError: state.walletReducer.convertWalletError,
  disableConvertWalletButton: state.walletReducer.disableConvertWalletButton
});
export default connect(mapStateToProps, null)(ConvertWallet);