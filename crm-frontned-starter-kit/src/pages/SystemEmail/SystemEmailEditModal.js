// a modal to only edit title and action
import React, { useEffect } from "react";
import {
  useDispatch, connect
} from "react-redux";
import {
  Modal, Button,
  ModalHeader,
  ModalBody,
  UncontrolledAlert,
} from "reactstrap";
import {
  AvForm, AvField, AvInput
} from "availity-reactstrap-validation";

import { capitalToReadable } from "common/utils/manipulateString";
import AvFieldSelect from "components/Common/AvFieldSelect";
import AvFieldTextTag from "components/Common/AvFieldTextTag";
import { EMAIL_FIELDS } from "common/data/dropdowns";
import Loader from "components/Common/Loader";

import { editSystemEmail } from "store/systemEmail/actions";
// i18n
import { withTranslation } from "react-i18next";

function SystemEmailEditModal(props){
  const { open, role = {}, onClose } = props;
  const dispatch = useDispatch();
  const handleEditSystemEmail = (e, values) => {
    dispatch(editSystemEmail({
      id: role.id,
      values
    }));
  };
  useEffect(()=>{
    if (props.editClearingCounter > 0 && open) {
      onClose();
    }
  }, [props.editClearingCounter]);

  // handling edit button after successfull edit
  const disableAddButton = () => (
    props.editResult ? true : false
  );

  return (
    <React.Fragment >
      <Modal isOpen={open} toggle={onClose} centered={true}>
        <ModalHeader toggle={onClose} tag="h4">
          {props.t("Edit system email")}
        </ModalHeader>
        <ModalBody >
          <AvForm
            className='p-4'
            onValidSubmit={(e, v) => {
              v.fields = v.fields && v.fields.map(obj => obj.value) || [];
              handleEditSystemEmail(e, v);
              props.systemEmailUpdatedHandler();
            }}
          >
            <div className="mb-3">
              <AvField
                name="title"
                label={props.t("Title")}
                placeholder={props.t("Enter Title")}
                type="text"
                value={role.title}
                errorMessage={props.t("Enter Title")}
                validate={{ required: { value: true } }}
              />
            </div>

            <div className="mb-3">
              <AvFieldSelect 
                name="action"
                label={props.t("Action")}
                placeholder={props.t("Please Select Action")}
                value={role.action}
                type="text"
                errorMessage={props.t("Enter Action")}
                validate={{ required: { value: true } }}

                options={props.actions.map((action)=>{
                  return ({
                    label: capitalToReadable(action),
                    value: action
                  });
                })}
              />
            </div>
            <div className="mb-3">
              <AvFieldTextTag
                name="fields"
                label={props.t("Fields")}
                value={role.fields}
                type="text"
                options={EMAIL_FIELDS}

              />
            </div>
            {role.permissions && Object.keys(role.permissions).map((permKey, permInd) =>
              <div className="mb-3" key={permInd}>
                <h6 className="text-capitalize">{permKey}</h6>
                {role.permissions[permKey] && Object.keys(role.permissions[permKey]).map((permission, permissionInd) =>
                  <React.Fragment key={permissionInd}>
                    <AvInput type="checkbox" name={`permissions.${permKey}.${permission}`} value={role.permissions[permKey][permission]} />
                    <span className="p-2" >{permission}</span>
                  </React.Fragment>
                )}                     
              </div>
            )}
            {/* submit button */}
            {
              props.editLoading
                ?
                <Loader />
                :
                <div className='text-center pt-3 p-2'>
                  <Button 
                    disabled={disableAddButton()} 
                    type="submit" 
                    color="primary"
                  >
                    {props.t("Edit")}
                  </Button>
                </div>
            }
          </AvForm>
          {props.editError && <UncontrolledAlert color="danger">
            <i className="mdi mdi-block-helper me-2"></i>
            {/* TODO this needs to be handled in translation */}
            {props.t(JSON.stringify(props.editError))}
          </UncontrolledAlert>}
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
}


const mapStateToProps = (state) => ({
  addLoading: state.systemEmailsReducer.addLoading,
  editResult: state.systemEmailsReducer.editResult,
  editError: state.systemEmailsReducer.editError,
  editClearingCounter: state.systemEmailsReducer.editClearingCounter,
  actions :state.dictionaryReducer.actions || [],
  editLoading: state.systemEmailsReducer.editLoading
});

export default connect(mapStateToProps, null)(withTranslation()(SystemEmailEditModal));