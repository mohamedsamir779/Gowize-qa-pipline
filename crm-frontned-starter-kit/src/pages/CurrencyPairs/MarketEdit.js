import React from "react";
import {
  connect, useDispatch
} from "react-redux";
import { withTranslation } from "react-i18next";
import {
  Row, Col,
  Modal, Button,
  ModalHeader,
  ModalBody,
  UncontrolledAlert,
} from "reactstrap";
import {
  AvForm, AvField, AvInput, 
} from "availity-reactstrap-validation";
import { editMarketStart } from "store/markets/actions";

function MarketEdit(props) {
  const dispatch = useDispatch();
  const {
    open, market = {
      fee:{},
      minAmount:{} 
    }, onClose 
  } = props;
  const handleMarketUpdate = (e, values) => {
    e.preventDefault();
    const id = market._id;
    dispatch(editMarketStart({
      id,
      values
    }));
  };
  return (
    <React.Fragment >
      <Modal isOpen={open} toggle={onClose} centered={true}>
        <ModalHeader toggle={onClose} tag="h4">
          {props.t("Edit Market")}
        </ModalHeader>
        <ModalBody >
          <AvForm
            className='p-4'
            onValidSubmit={(e, v) => {
              handleMarketUpdate(e, v);
            }}
          >
            <Row>
              <Col md="12">
                <div className="mb-3">
                  <AvField
                    name="name"
                    label={props.t("Name")}
                    placeholder={props.t("Name")}
                    type="text"
                    value={market.name}
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
                    name="fee"
                    label={props.t("Fee")}
                    placeholder={props.t("Fee")}
                    type="number"
                    min="0"
                    value={market.fee["$numberDecimal"]}
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
                    placeholder={props.t("Minimum Amount")}
                    type="number"
                    min="0"
                    value={market.minAmount["$numberDecimal"]}
                    errorMessage={props.t("Enter valid Minimum Amount")}
                    validate={{ required: { value: true } }}
                  />
                </div>
              </Col>
            </Row> 
            <Row>
              <Col md="6">
                <AvInput type="checkbox" name="active" validate={{ required: { value: true } }} value={market.active} /> is it active?
              </Col>
            </Row>
            <div className='text-center pt-3 p-2'>
              <Button disabled={props.addLoading} type="submit" color="primary" className="">
                {props.t("Update Market")}
              </Button>
            </div>
          </AvForm>
          {props.error && <UncontrolledAlert color="danger">
            <i className="mdi mdi-block-helper me-2"></i>
            {props.t(props.error)}
          </UncontrolledAlert>}
          {props.editDone && <UncontrolledAlert color="success">
            <i className="mdi mdi-check-all me-2"></i>
            {props.t("Market Updated successfully !!!")}
          </UncontrolledAlert>}
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
}
const mapStateToProps = (state) => ({
  editLoading: state.marketsReducer.editLoading,
  editDone: state.marketsReducer.editDone,
  editClear: state.marketsReducer.editClear,  
  error:state.marketsReducer.error
});
export default connect(mapStateToProps, null)(withTranslation()(MarketEdit));
