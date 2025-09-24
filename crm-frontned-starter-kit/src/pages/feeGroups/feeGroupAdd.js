
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
  Collapse,
  Card
} from "reactstrap";
import classnames from "classnames";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { 
  AvForm, 
  AvField,
  AvInput,
  AvGroup
} from "availity-reactstrap-validation";
import { withTranslation } from "react-i18next";
import { addFeesGroupStart } from "store/feeGroups/actions";

function feeGroupAdd(props) {

  const [addModal, setAddUserModal] = useState(false);
  const [isPercentage, setIsPercentage] = useState(false);
  const [col1, setcol1] = useState(true);
  const { create } = props.feeGroupsPermissions;
  const [value, setValue] = useState(0);
  const [minAmount, setMinAmount ] = useState(0);
  const [maxAmount, setMaxAmount] = useState(0);
  const dispatch = useDispatch();
  
  const handleAddFeesGroup = (event, values)=>{
    
    event.preventDefault();
    const { isPercentage, maxValue, title, minValue, value } = values;
    let marketsObject;
    props.markets.forEach((market, i )=>{
      marketsObject =  {
        ...marketsObject,
        [`${market.pairName}`]:{
          value : values [`fee${i}`],
          minValue: values[`minAmount${i}`],
          maxValue : values[`maxAmount${i}`]
        }
       
      };
    });
    dispatch(addFeesGroupStart({
      isPercentage,
      minValue,
      maxValue,
      title,
      markets: { ...marketsObject },
      value
    }));
  }; 

  const toggleAddModal = () => {
    setAddUserModal(!addModal);
  };
  const t_col1 = () => {
    setcol1(!col1);
  };

  useEffect(()=>{
    if (!props.showAddSuccessMessage  && addModal) {

      setAddUserModal(false);
    }
  }, [props.showAddSuccessMessage]);
 
  return (
    <React.Fragment >
      <Link to="#" className={`btn btn-primary ${!create ? "d-none" : ""}`} onClick={toggleAddModal}>
        <i className="bx bx-plus me-1"/> 
        {props.t("Add New Fees Group")}
      </Link>
      <Modal  isOpen={addModal} toggle={toggleAddModal} centered={true}>
        <ModalHeader toggle={toggleAddModal} tag="h4">
          {props.t("Add New Fees Group")}
        </ModalHeader>
        <ModalBody   >
          <AvForm
            className='p-4'
            onValidSubmit={(e, v) => {
              handleAddFeesGroup(e, v);
            }}
          >
            <Row>
              <Col>
                <div className="mb-3">
                  <AvField
                    name="title"
                    label={props.t("Title")}
                    placeholder={props.t("Enter title")}
                    type="text"
                    errorMessage={props.t("Enter Valid title")}
                    validate={{ required: { value: true } }}
                  />
                </div>
              </Col>
           
            </Row>
            <Row>
              <Col className="d-flex flex-column justify-content-center"><label>Default:</label></Col>
              <Col >
                
                <div className="mb-3">
                  <AvField
                    name="value"
                    label={props.t("Value")}
                    placeholder={props.t("Enter value")}
                    type="number"
                    min="0"
                    errorMessage={props.t("Enter valid fees group value")}
                    validate={{ 
                      required: { value: true },
                    }}
                    onChange = { (e)=> setValue(e.target.value)}
                  />
                </div>
              </Col>
              <Col>
                <div className="mb-3">
                  <AvField
                    name="maxValue"
                    label={props.t("Max Value")}
                    placeholder={props.t("Enter Max")}
                    type="number"
                    min="0"
                    errorMessage={props.t("Enter Valid max feees group value")}
                    validate={{ 
                      required: { value: true }
                    }}
                    onChange = {(e)=>setMaxAmount(e.target.value)}
                  />
                </div>
              </Col>
              <Col > 
                <div className="mb-3">
                  <AvField
                    name="minValue"
                    label={props.t("Min value")}
                    placeholder={props.t("Enter Min")}
                    type="number"
                    min="0"
                    errorMessage={props.t("Enter valid min fees group value")}
                    validate={{ 
                      required: { value: true }
                    }}
                    onChange = {(e)=>setMinAmount(e.target.value)}
                  />
                </div>
              </Col>
            </Row> 
            <Col>
              <div className="mb-3">
                <AvGroup check>
                  <AvInput type="checkbox" name="isPercentage" onClick={()=>setIsPercentage(preValue=>!preValue)} value={isPercentage ? "true" : "false"} />
                  <Label check for="checkItOut">Is Percentage</Label>
                </AvGroup>
               
              </div>
            </Col>
            <Col>
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
                            return <div key={market._id}> 
                              <Row className="mb-3">
                                <Col className="d-flex flex-column justify-content-center"><label>${pairName} </label></Col>
                                <Col>
                                  <AvField 
                                    name={`fee${i}`} 
                                    label="Value"
                                    type="number"
                                    min="0"
                                    validate = {{
                                      required :{ value:true }
                                    }} 
                                    placeholder = {props.t("Enter Value")}
                                    value={value}></AvField>
                                </Col>
                                <Col>
                                  <AvField 
                                    name={`maxAmount${i}`} 
                                    label="Max Value" 
                                    type="number"
                                    min="0"
                                    validate = {{
                                      required :{ value:true }
                                    }} 
                                    placeholder = {props.t("Enter Max")}
                                    value={maxAmount}></AvField>
                                </Col>
                                <Col>
                                  <AvField 
                                    name={`minAmount${i}`} 
                                    label="Min Value" 
                                    type="number"
                                    min="0"
                                    placeholder = {props.t("Enter Min")}
                                    validate = {{
                                      required :{ value:true }
                                    }} 
                                    value={minAmount}></AvField>
                                </Col>
                              </Row>
                            </div>;
                          })}   
                        </div>
                      </div>
                    </Collapse>
                  </div>
                </div>
              </Card>
            </Col>
            <div className='text-center pt-3 p-2'>
              <Button disabled={props.addButtonDisabled} type="submit" color="primary" className="">
                {props.t("Add")}
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
  showAddSuccessMessage: state.feeGroupReducer.showAddSuccessMessage,
  addButtonDisabled: state.feeGroupReducer.addButtonDisabled,
  feeGroupsPermissions: state.Profile.feeGroupsPermissions || {},
  markets: state.marketsReducer.markets || []
});

export default connect(mapStateToProps, null)(withTranslation()(feeGroupAdd));