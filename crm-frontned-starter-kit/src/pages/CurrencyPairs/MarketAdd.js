import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import {
  Button,
  Col,
  Modal, ModalBody, ModalHeader, Row, UncontrolledAlert 
} from "reactstrap";
import {
  AvForm, AvField, AvInput,
} from "availity-reactstrap-validation";
import { connect, useDispatch } from "react-redux";
import { addNewMarket } from "store/markets/actions";

function MarketAdd(props) {
  const [addModal, setAddUserModal] = useState(false);
  const dispatch = useDispatch();
  const { create } = props.currencyPairsPermissions;
  const toggleAddModal = () => {
    setAddUserModal(!addModal);
  };
  const handleAddMarket = (event, values) => {
    event.preventDefault();
    dispatch(addNewMarket(values));
  }; 
  useEffect(() => {
    if (!props.addMarketSuccessMessage  && addModal) {
      setAddUserModal(false);
    }
  }, [props.addMarketSuccessMessage]);
  const model = {
    name:"",
    baseAsset:"",
    quoteAsset:"",
    fee:"",
    minAmount :"",
    active:true
  };
  return (
    <React.Fragment>
      <Link to="#" className={`btn btn-primary ${!create ? "d-none" : ""}`} onClick={toggleAddModal}><i className="bx bx-plus me-1"></i>{props.t("Add New Market")}</Link>
      <Modal isOpen={addModal} toggle={toggleAddModal} centered={true}>
        <ModalHeader toggle={toggleAddModal} tag="h4">
          {props.t("Add New Market")}
        </ModalHeader>
        <ModalBody>
          <AvForm
            className='p-4'
            model={model}
            onValidSubmit={(e, v) => {
              handleAddMarket(e, v);
            }}
          >
            <Row>
              <Col md="12">
                <div className="mb-3">
                  <AvField
                    name="name"
                    label={props.t("Name")}
                    placeholder={props.t("Enter Name")}
                    type="text"
                    errorMessage={props.t("Enter name of the market")}
                    validate={{ required: { value: true } }}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <div className="mb-3">
                  <AvField
                    name="baseAsset"
                    label={props.t("Base Asset")}
                    placeholder={props.t("Enter Base Asset")}
                    type="text"
                    errorMessage={props.t("Enter Base Asset")}
                    validate={{ required: { value: true } }}
                  />
                </div>
              </Col>
              <Col md="6">
                <div className="mb-3">
                  <AvField
                    name="quoteAsset"
                    label={props.t("Quote Asset")}
                    placeholder={props.t("Enter Quote Asset")}
                    type="text"
                    errorMessage={props.t("Enter valid Quote Asset")}
                    validate={{ required: { value: true } }}
                  />
                </div>
              </Col>
            </Row> 
            <Row>
              <Col md="6">
                <div className="mb-3">
                  <AvField
                    name="fee"
                    label={props.t("Fee")}
                    placeholder={props.t("Enter Fee")}
                    type="number"
                    min="0"
                    errorMessage={props.t("Enter Fee")}
                    validate={{ required: { value: true } }}
                  />
                </div>
              </Col>
              <Col md="6">
                <div className="mb-3">
                  <AvField
                    name="minAmount"
                    label={props.t("Minimum Amount")}
                    placeholder={props.t("Enter Minimum Amount")}
                    type="number"
                    min="0"
                    errorMessage={props.t("Enter valid Minimum Amount")}
                    validate={{ required: { value: true } }}
                  />
                </div>
              </Col>
            </Row> 
            <Row>
              <Col md="6">
                {/* <Input type="checkbox" name="active" id="active" switch="none"  />
                <Label className="me-1" htmlFor="active" data-on-label={props.t("Active")} data-off-label=""></Label> */}
                <AvInput type="checkbox" name="active" trueValue={true} /> Is It Active?
              </Col>
            </Row>
            <div className='text-center pt-3 p-2'>
              <Button  type="submit" color="primary" className="">
                {props.t("Add")}
              </Button>
            </div>
          </AvForm>
          {props.error && <UncontrolledAlert color="danger">
            <i className="mdi mdi-block-helper me-2"></i>
            {props.t(props.error)}
          </UncontrolledAlert>}
          {props.addMarketSuccessMessage && <UncontrolledAlert color="success">
            <i className="mdi mdi-check-all me-2"></i>
            {props.t("Market Added successfully !!!")}
          </UncontrolledAlert>}
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
}
const mapStateToProps = (state) => ({
  error: state.marketsReducer.error,
  addMarketSuccessMessage: state.marketsReducer.addMarketSuccessMessage,
  currencyPairsPermissions : state.Profile.currencyPairsPermissions || {}
});
export default  connect(mapStateToProps, null)(withTranslation()(MarketAdd));