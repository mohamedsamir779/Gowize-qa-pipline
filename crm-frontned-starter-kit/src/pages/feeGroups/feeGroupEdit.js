
import { useDispatch, connect } from "react-redux";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  UncontrolledAlert,
  Col,
  Row,
  Label,
  Card,
  Collapse
} from "reactstrap";

import React, { 
  useState, 
  useEffect, 
} from "react";
import { 
  AvForm, 
  AvField,
} from "availity-reactstrap-validation";
import { withTranslation } from "react-i18next";
import { editFeeGroupStart } from "store/feeGroups/actions";
import classnames from "classnames";
function feeGroupAdd(props) {
  
  const { open, selectedItem = {}, onClose, disabled } = props;
  
  const { maxValue, value: v, minValue } = selectedItem;
  const [isPercentage, setIsPercentage] = useState();
  const [col1, setcol1] = useState(true);
  const t_col1 = () => {
    setcol1(!col1);
  };
  const [value, setValue] = useState(0);
  const [minAmount, setMinAmount] = useState(0);
  const [maxAmount, setMaxAmount] = useState(0);
  useEffect(()=>{
    setIsPercentage(selectedItem.isPercentage);
  }, [selectedItem.isPercentage]);
 
  const dispatch = useDispatch();
  const updateFeeGroup = (event, values)=>{
    const { isPercentage, minValue, maxValue, title, value } = values;
    event.preventDefault();
    let marketsObject = {};
    props.markets.forEach((market, i)=>{
      marketsObject = {
        ...marketsObject,
        [`${market.pairName}`]:{
          value : values[`fee${i}`],
          minValue : values[`minAmount${i}`],
          maxValue :values[`maxAmount${i}`]
        }
      };
    });
    dispatch(editFeeGroupStart(selectedItem._id, {
      isPercentage,
      minValue,
      maxValue,
      title,
      value,
      markets:{ ...marketsObject }
    }
    ));
  };
  return (
    <React.Fragment >
      
      <Modal isOpen={open} toggle={onClose} centered={true}>
        <ModalHeader toggle={onClose} tag="h4">
          {props.t("Update Fee Group")}
        </ModalHeader>
        <ModalBody  >
          <AvForm
            className='p-4'
            onValidSubmit={(e, v) => {
              updateFeeGroup(e, {
                ...v,
                isPercentage:isPercentage
              });
            }}
          >
            <Row>
              
              <Col >
                <div className="mb-3">
                  <AvField
                    name="title"
                    label={props.t("Title")}
                    placeholder={props.t("Enter title")}
                    type="text"
                    value = {selectedItem.title}
                    errorMessage={props.t("Enter Valid title")}
                    validate={{ required: { value: true } }}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col className= "d-flex flex-column justify-content-center"><label>Default:</label></Col>
              <Col >
                <div className="mb-3">
                  <AvField
                    name="value"
                    label={props.t("Value")}
                    placeholder={props.t("Enter value")}
                    type="number"
                    min="0"
                    value={v ? v.$numberDecimal : ""}
                    validate = {{
                      required :{ value:true }
                    }} 
                    onChange = {(e)=>setValue(e.target.value)}
                  />
                </div>
              </Col>
              <Col >
                <div className="mb-3">
                  <AvField
                    name="maxValue"
                    label={props.t("Max Value")}
                    placeholder={props.t("Enter Max")}
                    type="number"
                    min="0"
                    value= {maxValue ? maxValue.$numberDecimal : ""}
                    onChange = {(e)=>setMaxAmount(e.target.value)}
                    validate = {{
                      required :{ value:true }
                    }} 
                  />
                </div>
              </Col>
              <Col > 
                <div className="mb-3">
                  <AvField
                    name="minValue"
                    label={props.t("Min Value")}
                    placeholder={props.t("Enter Min")}
                    type="number"
                    min="0"
                    value={ minValue ? minValue.$numberDecimal : ""}
                    onChange = {(e)=>setMinAmount(e.target.value)}
                    validate = {{
                      required :{ value:true }
                    }} 
                  />
                </div>
              </Col>
            </Row> 
          
            <div className="mb-3">
              <input 
                checked={isPercentage}
                type="checkbox"
                name="isPercentage"
                onChange={()=>setIsPercentage(preValue=>!preValue)} 
                value={isPercentage ? "True" : "False"} />
              <Label check for="isPercentage">Is Percentage</Label>
            </div>
            <Col xl={12}>
              <Card>
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
                       Markets
                      </button>
                    </h2>

                    <Collapse isOpen={col1} className="accordion-collapse">
                      <div className="accordion-body">
                        <div className="text-muted">
                          {props.markets.map((market, i)=>{ 
                            const { pairName } = market;
                            return (
                              <Row key={market._id}>
                                <Col className="d-flex flex-column justify-content-center"><label>{pairName}</label></Col>
                                <Col>
                                  <AvField 
                                    name={`fee${i}`} 
                                    label="Value" 
                                    type="number"
                                    min="0"
                                    defaultValue={ v ? v.$numberDecimal : ""} 
                                    validate = {{
                                      required :{ value:true }
                                    }} 
                                    value={value}></AvField>
                                </Col>
                                <Col>
                                  <AvField 
                                    name={`maxAmount${i}`} 
                                    label="Max Value" 
                                    type="number"
                                    min="0"
                                    defaultValue={ maxValue ? maxValue.$numberDecimal : "" }
                                    value={maxAmount}
                                    validate = {{
                                      required :{ value:true }
                                    }} 
                                  ></AvField>
                                </Col>
                                <Col>
                                  <AvField 
                                    name={`minAmount${i}`} 
                                    label="Min Value"
                                    type="number"
                                    min="0"
                                    defaultValue = { minValue ? minValue.$numberDecimal : ""}
                                    validate = {{
                                      required :{ value:true }
                                    }} 
                                    value={minAmount}></AvField>
                                </Col>
                              </Row>
                            );
                          })}   
                        </div>
                      </div>
                    </Collapse>
                  </div>
                </div>
              </Card>
            </Col>
            <div className='text-center pt-3 p-2'>
              <Button  disabled={disabled} type="submit" color="primary" className="">
                {props.t("Edit")}
              </Button>
            </div>
          </AvForm>
          {
            props.error && (
              <UncontrolledAlert color="danger">
                <i className="mdi mdi-block-helper me-2"/>
                {props.t(props.error)}
              </UncontrolledAlert>
            )
          }
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => ({
  error: state.feeGroupReducer.error,
  showEditSuccessMessage: state.feeGroupReducer.showEditSuccessMessage,
  markets: state.marketsReducer.markets || []
});

export default connect(mapStateToProps, null)(withTranslation()(feeGroupAdd));