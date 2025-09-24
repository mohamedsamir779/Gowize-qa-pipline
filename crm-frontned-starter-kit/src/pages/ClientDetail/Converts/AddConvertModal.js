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
import "./SearchableInputStyles.scss";
import { withTranslation } from "react-i18next";
import Select from "react-select";
import Loader from "components/Common/Loader";
import { fetchAssetsStart } from "store/assests/actions";
import { fetchClientWallets } from "store/wallet/list/action";
import { addConvert } from "store/converts/actions";

function AddConvertModal(props){
  const dispatch = useDispatch();
  const customerId = props.clientId;
  const [addModal, setAddModal] = useState(false);
  const [fromAsset, setFromAsset] = useState("");
  const [toAsset, setToAsset] = useState("");
  const [fromAssetId, setFromAssetId] = useState("");
  const [toAssetId, setToAssetId] = useState("");

  const toggleAddModal = () => {
    setAddModal(!addModal);
    setFromAsset("");
    setToAsset("");
    setFromAssetId("");
    setToAssetId("");
  };

  useEffect(() => {
    if (!props.disableAddButton && open ){
      setAddModal(false);
    }
  }, [props.modalClear]);

  const handleAddConvert = (e, v) => {
    dispatch(addConvert({
      toAsset,
      fromAsset,
      fromAssetId,
      toAssetId,
      amount: v.amount,
      customerId
    }));
  };

  useEffect(() => {
    dispatch(fetchAssetsStart({
      page:1,
      limit:1000
    }));
    dispatch(fetchClientWallets({ belongsTo: customerId }));
  }, []);

  return (
    <React.Fragment >
      <Link to="#" className="btn btn-primary" onClick={toggleAddModal}><i className="bx bx-plus me-1"></i> {props.t("Add New Convert")}</Link>
      <Modal isOpen={addModal} toggle={toggleAddModal} centered={true}>
        <ModalHeader toggle={toggleAddModal} tag="h4">
          {props.t("Add New Convert")}
        </ModalHeader>
        <ModalBody >
          <AvForm
            className='p-4'
            onValidSubmit={(e, v) => {
              delete v.fromAsset;
              delete v.toAsset;
              handleAddConvert(e, v);
            }}
          >
            {/* from asset */}
            <Row className="mb-3">
              <Col md="12">
                <Label>{props.t("From Asset")}</Label>
                <div>
                  <Select 
                    required
                    onChange={(e) => {
                      setFromAsset(e.value.asset);
                      setFromAssetId(e.value.id);
                    }}
                    isOptionDisabled={(option) => option.value.asset == toAsset}
                    options={props.wallets && props.wallets.map((wallet)=>{
                      return {
                        label:`${wallet.asset} (${wallet.amount})`,
                        value:{
                          id:wallet._id,
                          asset:wallet.asset
                        }
                      };
                    })}
                    isSearchable = {true}
                    classNamePrefix="select2-selection"
                    placeholder = "Choose An Asset"    
                  />
                  <AvField
                    name="fromAsset"
                    type="text"
                    errorMessage={props.t("Choose An Asset")}
                    validate={{ required: { value: true } }}
                    value={fromAsset}
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

            {/* to asset */}
            <Row className="mb-3">
              <Col md="12">
                <Label>{props.t("To Asset")}</Label>
                <div>
                  <Select 
                    required
                    onChange={(e) => {
                      setToAsset(e.value.asset);
                      setToAssetId(e.value.id);
                    }}
                    isOptionDisabled={(option) => option.value.asset == fromAsset}
                    options={props.wallets && props.wallets.map((wallet)=>{
                      return {
                        label:`${wallet.asset} (${wallet.amount})`,
                        value:{
                          id:wallet._id,
                          asset:wallet.asset
                        }
                      };
                    })}
                    isSearchable = {true}
                    classNamePrefix="select2-selection"
                    placeholder = "Choose An Asset"    
                  />
                  <AvField
                    name="toAsset"
                    type="text"
                    errorMessage={props.t("Choose An Asset")}
                    validate={{ required: { value: true } }}
                    value={toAsset}
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

            {/* amount */}
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
          {props.addFail && <UncontrolledAlert color="danger">
            <i className="mdi mdi-block-helper me-2" />
            {props.t(props.addFailDetails)}
          </UncontrolledAlert>}
        </ModalBody> 
      </Modal>
    </React.Fragment>
  );
}
const mapStateToProps = (state) => ({
  wallets: state.walletReducer.docs || [],
  assets: state.assetReducer.assets || [],
  addFail: state.convertReducer.addFail,
  addLoading: state.convertReducer.addLoading,
  addFailDetails: state.convertReducer.addFailDetails
});
export default connect(mapStateToProps, null)(withTranslation()(AddConvertModal));