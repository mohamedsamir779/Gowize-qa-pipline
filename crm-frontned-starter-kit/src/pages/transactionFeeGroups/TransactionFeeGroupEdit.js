
import { useDispatch, connect } from "react-redux";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  UncontrolledAlert,
  Col,
  Row,
  Collapse,
  Label
} from "reactstrap";
import classnames from "classnames";

import React, { useState, useEffect } from "react";
import {
  AvForm,
  AvField,

} from "availity-reactstrap-validation";
import { withTranslation } from "react-i18next";
import { editTransactionFeeGroupStart } from "store/transactionFeeGroups/actions";
function TransactionFeeGroupEdit(props) {

  const { open, selectedItem = {}, onClose, disabled } = props;

  const [assets, setAssets] = useState([]);
  const [col1, setcol1] = useState(false);

  const [isPercentage, setIsPercentage] = useState();
  useEffect(() => {
    setIsPercentage(selectedItem.isPercentage);
  }, [selectedItem.isPercentage]);
  const dispatch = useDispatch();

  useEffect(() => {
    const assetsArrayOfObj = Object.entries(selectedItem?.assets || {}).map((e) => ({ [e[0]]: e[1] }));
    setAssets(assetsArrayOfObj); 
  }, [open]);

  const updateFeeGroup = (event, values) => {
    // console.log(values);
    event.preventDefault();
    const { isPercentage, maxValue, title, minValue, value } = values;
    let assetsObject = {};
    let val = {};
    assets?.forEach((asset, i) => {
      assetsObject = {
        ...assetsObject,
        [`${Object.keys(asset)[0]}`]: {
          value: values[`value${i}`],
          minValue: values[`minValue${i}`],
          maxValue: values[`maxValue${i}`]
        }
      };
    }); 
    val = {
      isPercentage,
      minValue,
      maxValue,
      title,
      assets: { ...assetsObject },
      value
    };
    dispatch(editTransactionFeeGroupStart(
      selectedItem._id,
      val
    )); 
    setcol1(false);
  };
  // const updateFeeGroup = (event, values) => {
  //   event.preventDefault();
  //   dispatch(editTransactionFeeGroupStart(selectedItem._id, values
  //   ));
  // };
  const t_col1 = () => {
    setcol1(!col1);
  };
  return (
    <React.Fragment >

      <Modal size="lg" isOpen={open} toggle={onClose} centered={true}>
        <ModalHeader toggle={onClose} tag="h4">
          {props.t("Update Transaction Fee Group")}
        </ModalHeader>
        <ModalBody >
          <AvForm
            className='p-4'
            onValidSubmit={(e, v) => {
              updateFeeGroup(e, {
                ...v,
                isPercentage: isPercentage
              });
            }}
          >
            <Row>
              <Col md="6">
                <div className="mb-3">
                  <AvField
                    name="title"
                    label={props.t("Title")}
                    placeholder={props.t("Enter Enter Title")}
                    type="text"
                    value={selectedItem.title}
                    errorMessage={props.t("Enter Valid title")}
                    validate={{ required: { value: true } }}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col md="4">
                <div className="mb-3">
                  <AvField
                    name="value"
                    label={props.t("Value")}
                    placeholder={props.t("Enter Enter value")}
                    type="number"
                    min="0"
                    value={selectedItem.value?.$numberDecimal}
                    errorMessage={props.t("Enter valid fees group value")}
                    validate={{ required: { value: true } }}
                  />
                </div>
              </Col>

              <Col md="4">
                <div className="mb-3">
                  <AvField
                    name="minValue"
                    label={props.t("Min value")}
                    placeholder={props.t("Enter Enter min value")}
                    type="number"
                    min="0"
                    value={selectedItem.minValue?.$numberDecimal}
                    errorMessage={props.t("Enter valid min fees group value")}
                    validate={{ required: { value: true } }}
                  />
                </div>
              </Col>
              <Col md="4">
                <div className="mb-3">
                  <AvField
                    name="maxValue"
                    label={props.t("Max Value")}
                    placeholder={props.t("Enter Enter Max Value")}
                    type="number"
                    min="0"
                    value={selectedItem.maxValue?.$numberDecimal}
                    errorMessage={props.t("Enter Valid max feees group value")}
                    validate={{ required: { value: true } }}
                  />
                </div>
              </Col>
            </Row>

            <div className="mb-3">

              <input
                checked={isPercentage}
                type="checkbox"
                name="isPercentage"
                onChange={() => setIsPercentage(preValue => !preValue)}
                value={isPercentage ? "True" : "False"} />
              <Label check for="isPercentage">Is Percentage</Label>

            </div>

            <Row>
              <Col >
                <div className="accordion" id="accordion">
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingOne">
                      <button
                        className={classnames(
                          "accordion-button",
                          "fw-medium",
                          { collapsed: !col1 }
                        )}
                        type="button"
                        onClick={t_col1}
                        style={{ cursor: "pointer" }}
                      >
                        Individual Asset fees
                      </button>
                    </h2>

                    <Collapse isOpen={col1} className="accordion-collapse">
                      <div className="accordion-body">
                        {assets?.map((market, index) => {
                          let [key, value] = Object.entries(market)[0];
                          return (
                            <div key={index}>
                              <Row>
                                <Col md="2" className="d-flex flex-column justify-content-end"><h5 className="text-center"> {key}</h5></Col>
                                <Col >
                                  <AvField
                                    name={`value${index}`}
                                    label={props.t("Value")}
                                    value={value?.value}
                                    placeholder={props.t("Enter Value")}
                                    type="number"
                                    min="0"
                                  />
                                </Col>
                                <Col >
                                  <AvField
                                    name={`minValue${index}`}
                                    label={props.t("Min Value")}
                                    value={value?.minValue}
                                    placeholder={props.t("Enter Min Value")}
                                    type="number"
                                    min="0"
                                  />
                                </Col>
                                <Col >
                                  <AvField
                                    name={`maxValue${index}`}
                                    label={props.t("Max Value")}
                                    value={value?.maxValue}
                                    placeholder={props.t("Enter Max Value")}
                                    type="number"
                                    min="0"
                                  />
                                </Col>
                              </Row>
                              <br />
                              <br />
                            </div>
                          );
                        }
                        )}
                      </div>
                    </Collapse>
                  </div>
                </div>
              </Col>
            </Row>
            <div className='text-center pt-3 p-2'>
              <Button disabled={disabled} type="submit" color="primary" className="">
                {props.t("Edit Transaction Fee Group")}
              </Button>
            </div>
          </AvForm>
          {
            props.error && (
              <UncontrolledAlert color="danger">
                <i className="mdi mdi-block-helper me-2" />
                {props.t(props.error)}
              </UncontrolledAlert>
            )
          }
          {/* {
            props.showEditSuccessMessage && (
              <UncontrolledAlert color="success">
                <i className="mdi mdi-check-all me-2" />
                {props.t("Transaction Fees Group is updated successfully !!!")}
              </UncontrolledAlert>
            )
          } */}
        
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => ({
  error: state.transactionFeeGroupReducer.error,
  showEditSuccessMessage: state.transactionFeeGroupReducer.showEditSuccessMessage,
});

export default connect(mapStateToProps, null)(withTranslation()(TransactionFeeGroupEdit));