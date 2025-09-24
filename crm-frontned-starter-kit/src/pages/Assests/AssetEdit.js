import React, { useEffect, useState } from "react";
import {
  useDispatch, connect, useSelector
} from "react-redux";
import {
  Row, Col,
  Modal, Button,
  ModalHeader,
  ModalBody,
  Label,
  UncontrolledAlert,
} from "reactstrap";
import {
  AvForm, AvField, 
} from "availity-reactstrap-validation";
import { withTranslation } from "react-i18next";
import { editSymbolStart } from "store/assests/actions";
import AvFieldSelect from "../../components/Common/AvFieldSelect";
import { fetchMarkupsStart } from "store/markups/actions";

function AssetEdit (props) {
  const [file, setFile] = useState();
  const { open, symbol = {}, onClose } = props;
  const { markups } = useSelector(state=>state.markupsReducer);
  let minDepositAmount;
  let minWithdrawAmount;
  let depositFee;
  let withdrawalFee;
  if (symbol.minAmount){
    const { minAmount:{ deposit, withdrawal } } = symbol;
    minDepositAmount = deposit;
    minWithdrawAmount = withdrawal;
  }
  const { image } = symbol;
  if (symbol.fee){
    const { fee:{ deposit, withdrawal } } = symbol;
    depositFee = deposit;
    withdrawalFee = withdrawal;
  }
  const dispatch = useDispatch();
  
  const handleSymbolUpdate = (e, values) => {
    e.preventDefault();
    const id = symbol._id;
    const formData = new FormData();
    formData.append("image", file);
    formData.append("symbol",  values.symbol);
    formData.set("minAmount", JSON.stringify({
      deposit :values.minDepositAmount,
      withdrawal:values.minWithdrawAmount
    }));
    formData.set("fee", JSON.stringify({
      deposit:values.depositFee,
      withdrawal:values.withdrawFee
    }));
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("markup", values.markup);
    formData.append("explorerLink", values.explorerLink);
    dispatch(editSymbolStart({
      id,
      formData,
      jsonData: {
        ...values,
        image:file
      }
    }));
  };

  useEffect(()=>{
    
    if (props.editClear) {
      onClose();
    }
  }, [props.editClear]);

  useEffect(()=>{
    dispatch(
      fetchMarkupsStart()
    );  
  }, []);

  const validateFile = (value, ctx, input, cb)=> {
    const extensions = ["png", "jpg", "jpeg", "pdf"];
    const extension = value.split(".")[1];
    if (extensions.includes(extension) || !value){
      if (!value || file.size <= 2097152){
        cb(true);
      } else cb("2mb maximum size");
    } else cb("Only images or PDF can be uploaded");    
  };


  return (
    <React.Fragment >
      {/* <Link to="#" className="btn btn-light" onClick={onClose}><i className="bx bx-plus me-1"></i> Add New</Link> */}
      <Modal isOpen={open} toggle={onClose} centered={true} size="lg">
        <ModalHeader toggle={onClose} tag="h4">
          {props.t("Edit Symbol")}
        </ModalHeader>
        <ModalBody >
          <AvForm
            className='p-4'
            onValidSubmit={(e, v) => {
              handleSymbolUpdate(e, v);
            }}
          >
            <Row>
              <Col md="6">
                <div className="mb-3">
                  <AvField
                    name="name"
                    label={props.t("Name")}
                    placeholder={props.t("Enter Name")}
                    type="text"
                    errorMessage={props.t("Enter name of the symbol")}
                    value={symbol.name}
                    validate={{ required:{ value:true } } }
                  />
                </div>
              </Col>
              <Col md="6"> 
                <div className="mb-3">
                  <AvField
                    name="symbol"
                    label={props.t("Symbol")}
                    placeholder={props.t("Enter Symbol")}
                    type="text"
                    errorMessage={props.t("Enter symbol")}
                    value={symbol.symbol}
                    validate={{ required:{ value:true } } }
                  />
                </div>
              </Col> 
            </Row>
            <Row>
              <Col md="6">
                <div className="mb-3">
                  <AvField
                    name="description"
                    label={props.t("Description")}
                    placeholder={props.t("Enter Description")}
                    type="text"
                    errorMessage={props.t("Enter description")}
                    value={symbol.description}
                    validate={{ required:{ value:true } } }
                  />
                </div>
              </Col>
              <Col md="6">
                <div className="mb-3">
                  <AvFieldSelect
                    name="markup"
                    label={props.t("Mark up")}
                    type="text"
                    errorMessage={props.t("Enter valid markup")}
                    value={symbol.markup}
                    options={markups && markups.length > 0 && markups.map((obj)=>{
                      return ({
                        label: `${obj.title} ${obj.value.$numberDecimal}`, 
                        value: obj
                      });
                    })}
                  >
                  </AvFieldSelect>
                </div>
              </Col>
            </Row> 
            <Row>
              <Col md="6">
                <div className="mb-3">
                  <AvField
                    name="depositFee"
                    label={props.t("Desposit Fee")}
                    placeholder={props.t("Enter Desposit Fee")}
                    type="number"
                    errorMessage={props.t("Enter valid deposit fee")}
                    value={depositFee}
                    min="0"
                    validate = {{
                      required :{ value:true }
                    }}
                  />
                </div>
              </Col>
              <Col md="6"> 
                <div className="mb-3">
                  <AvField
                    name="withdrawFee"
                    label={props.t("Withdraw Fee")}
                    placeholder={props.t("Enter Withdrawal Fee")}
                    type="number"
                    errorMessage={props.t("Enter valid withdraw fee")}
                    value={withdrawalFee}
                    min="0"
                    validate = {{
                      required :{ value:true }
                    }}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <div className="mb-3">
                  <AvField
                    name="minDepositAmount"
                    label={props.t("Min Deposit Amount")}
                    placeholder={props.t("Enter Min Deposit Amount")}
                    type="number"
                    min="0"
                    errorMessage={props.t("Enter valid deposit amount")}
                    value={minDepositAmount}
                    validate = {{
                      required :{ value:true }
                    }}
                  />
                </div>
              </Col>
              <Col md="6"> 
                <div className="mb-3">
                  <AvField
                    name="minWithdrawAmount"
                    label={props.t("Min Withdraw Amount")}
                    placeholder={props.t("Enter Min Withdrawal Amount")}
                    type="number"
                    min="0"
                    errorMessage={props.t("Enter valid withdraw amount")}
                    value={minWithdrawAmount}
                    validate = {{
                      required :{ value:true },
                      pattern : {
                        // eslint-disable-next-line no-useless-escape
                        value :"^[0-9]+(\\.([0-9]{1,4}))?$",
                        errorMessage : "Min withdraw amount must be a number"
                      }
                    }}
                  />
                </div>
              </Col>
            </Row>
            <div className="mb-3">
              
              <AvField
                name="explorerLink"
                label="Link"
                placeholder="Enter Link"
                type="text"
                errorMessage="explorer link"
                value={symbol.explorerLink}
                validate={{ required:{ value:true } } }
              />
            </div>
            <div>
              <div className="d-flex gap-3 mb-3">
                <Label className="d-flex my-auto">Asset Image</Label>
                <img style = {{ width:"50px" }} src ={`${process.env.REACT_APP_API_CRM_DOMAIN}/images/${image}`} alt= ""/>
              </div>
           
              <AvField
                className ="d-inline"
                name="image"
                type="file"
                errorMessage = {props.t("Please upload an image for the symbol")}
                validate = {{
                  custom:validateFile 
                }}
                onChange = {e=>setFile(e.target.files[0])}
              />
   
            </div>
            <div className='text-center pt-3 p-2'>
              <Button disabled={props.disableEditButton} type="submit" color="primary" className="">
                {props.t("Edit")}
              </Button>
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
  editClear: state.assetReducer.editClear,  
  error:state.assetReducer.error,
  disableEditButton: state.assetReducer.disableEditButton
});
export default connect(mapStateToProps, null)(withTranslation()(AssetEdit));
