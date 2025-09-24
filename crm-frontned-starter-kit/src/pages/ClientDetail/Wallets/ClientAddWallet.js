import React, { useState, useEffect } from "react";
import {
  Link
} from "react-router-dom";
import { useDispatch, connect } from "react-redux";
import {
  Modal, Button, ModalHeader, ModalBody, UncontrolledAlert
} from "reactstrap";
import { AvField, AvForm } from "availity-reactstrap-validation";
import Select from "react-select";

// i18n
import { withTranslation } from "react-i18next";
import { fetchAssetsStart } from "store/assests/actions";
import { addWallet } from "store/wallet/list/action";
import { enableCrypto } from "config";
import TableLoader from "components/Common/TableLoader";
import CustomSelect from "components/Common/CustomSelect";

function ClientAddWallet(props){
  const [addModal, setAddModal] = useState(false);
  const dispatch = useDispatch();
  const fetchAssetsHandler = () => {
    dispatch(fetchAssetsStart({
      page: 1,
      limit: 1000,
    })) ;
  };
  const toggleAddModal = () => {
    setAddModal(!addModal);
  };
  const addNewWalletHandler = (e, v) => {
    dispatch(addWallet(v));
  };
  useEffect(()=>{
    fetchAssetsHandler();
  }, []);
  useEffect(()=>{
    if (props.addClearingCounter > 0 && addModal) {
      setAddModal(false);
    }
  }, [props.addClearingCounter]);

  const [selectedAsset, setSelectedAsset] = useState();
  const assetOptions = props.assets.map((asset) => {
    // value is Id which is sent to the server 
    // label is the asset's name which the user can see
    return ({
      value: asset._id,
      label: asset.name
    });
  });
  const assetChangeHandler = (selectedAsset) => {
    setSelectedAsset(selectedAsset);
  };

  return (
    <React.Fragment >
      <Link to="#" className="btn btn-primary" onClick={toggleAddModal}>
        <i className="bx bx-plus me-1"></i> {props.t("Add New Wallet")} 
      </Link>
      <Modal isOpen={addModal} toggle={toggleAddModal} centered={true}>
        <ModalHeader toggle={toggleAddModal} tag="h4">
          {props.t("Add new wallet")} 
        </ModalHeader>
        <ModalBody >
          <AvForm
            className='p-4'
            onValidSubmit={(e, v) => {
              v.belongsTo = props.clientId;
              v.symbol = selectedAsset.value;
              addNewWalletHandler(e, v);
            }}
          >
            <div className="mb-3">
              <CustomSelect
                value={selectedAsset}
                options={assetOptions}
                onChange={assetChangeHandler} 
              />
              <AvField 
                name="symbol"
                placeholder={props.t("Select Asset")}
                type="text"
                errorMessage={props.t("Select Asset")}
                validate={{ required: { value: true } }}
                value={selectedAsset}
                style={{
                  opacity: 0,
                  height: 0,
                  margin: -10
                }}
              />
            </div>
            <div className='text-center pt-3 p-2'>
              <Button disabled={props.addLoading} type="submit" color="primary">
                {props.addLoading ? <TableLoader /> : props.t("Add")}
              </Button>
            </div>
          </AvForm>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => ({
  addLoading: state.walletReducer.wallet.addLoading,
  addFailDetails: state.walletReducer.wallet.addFailDetails,
  addSuccess: state.walletReducer.wallet.addSuccess,
  addFail: state.walletReducer.wallet.addFail,  
  addClearingCounter: state.walletReducer.wallet.addClearingCounter,
  activeComponentProp: state.walletReducer.wallet.activeComponentProp,
  limit: state.assetReducer.limit,
  page: state.assetReducer.page || 1,
  assets: state.assetReducer.assets || []
});

export default connect(mapStateToProps, null)(withTranslation()(ClientAddWallet));