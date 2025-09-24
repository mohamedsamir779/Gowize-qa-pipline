import { useDispatch, connect } from "react-redux";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  UncontrolledAlert,
} from "reactstrap";
import { withTranslation } from "react-i18next";
import React from "react";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { updateCountryStart } from "store/dictionary/actions";
function CountriesEdit(props){
  const { open, onClose, country = {} } = props;
  const dispatch = useDispatch();
  const { alpha2, alpha3, ar, en, callingCode } = country;
  return (
    <React.Fragment >
      
      <Modal isOpen={open} toggle={onClose} centered={true}>
        <ModalHeader toggle={onClose} tag="h4">
          {props.t("Edit Country")}
        </ModalHeader>
        <ModalBody >
          <AvForm
            className='p-4'
            onValidSubmit={(e, v) => {
              e.preventDefault();
              dispatch(updateCountryStart({
                value:v,
                body:{
                  countries :{ _id:country._id }
                }
              }));
            }}
          >
            
            
            <div className="mb-3">
              <AvField
                name="alpha2"
                label={props.t("Alpha2")}
                value={props.t(alpha2)}
                placeholder={props.t("Enter Alpha2")}
                type="text"
                errorMessage={props.t("Enter valid alpha2")}
                validate={{ 
                  required: { value: true },
                  pattern:{
                    value:"/^[a-z]{2}$/",
                    errorMessage: "Aplha2 should be 2 characters only"
                  }
                }}
              />
            </div>
            <div className="mb-3">
              <AvField
                name="alpha3"
                label={props.t("Alpha3")}
                value = {props.t(alpha3)}
                placeholder={props.t("Enter Alpha3")}
                type="text"
                validate={{
                  required: { value: true }, 
                  pattern:{
                    value : "/^[a-z]{3}$/",
                    errorMessage:"Alpha3 should be 3 characters only"
                  }
                }}
              />
            </div>
            <div className="mb-3">
              <AvField
                name="callingCode"
                label={props.t("Calling Code")}
                value = {props.t(callingCode)}
                placeholder={props.t("Enter Calling Code")}
                type="text"
                errorMessage={props.t("Enter valid calling code")}
                onKeyPress={(e) => {
                  if (!isNaN(e.key) && e.target.value.length > 0){
                    return true;
                  }
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                validate={{
                  required: { value: true }
                }}
              />
            </div>
            <div className="mb-3">
              <AvField
                name="ar"
                label={props.t("Ar")}
                value = {props.t(ar)}
                placeholder={props.t("Enter the Arabic Country name")}
                type="text"
                validate={{ 
                  required: { value: true },
                  pattern : {
                    value :"/^[\u0621-\u064A]+$/",
                    errorMessage : "This field should be all in arabic letters"
                  }
                }}
              />
            </div>
            <div className="mb-3">
              <AvField
                name="en"
                label={props.t("EN")}
                value = {props.t(en)}
                placeholder={props.t("Enter the English Country name")}
                type="text"
                validate={{ 
                  required: { value: true },
                  pattern : {
                    value: "/^[A-Za-z]+$/",
                    errorMessage : "This field should be all in english letters"
                  }
              
                }}
              />
            </div>
            
            <div className='text-center pt-3 p-2'>
              <Button disabled = {props.disableEditButton} type="submit" color="primary" className="">
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
const mapStateToProps = (state)=>({
  loading: state.dictionaryReducer.loading || false,
  dictionary: state.dictionaryReducer.dictionary || [],
  error : state.dictionaryReducer.error,
  id :state.dictionaryReducer.id,
  editSuccess:state.dictionaryReducer.editSuccess,
  disableEditButton : state.dictionaryReducer.disableEditButton
});
export default connect(mapStateToProps, null)(withTranslation()(CountriesEdit));