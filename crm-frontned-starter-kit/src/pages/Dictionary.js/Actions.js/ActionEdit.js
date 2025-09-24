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
import { updateActionStart } from "store/dictionary/actions";
function MarkupsEdit(props){
  const { onClose, open, selectedAction = {} } = props;
  const dispatch = useDispatch();
  const { actions } = selectedAction;
  return (
    <React.Fragment >
      
      <Modal isOpen={open} toggle={onClose} centered={true}>
        <ModalHeader toggle={onClose} tag="h4">
          Edit Action
        </ModalHeader>
        <ModalBody >
          <AvForm
            className='p-4'
            onValidSubmit={(e, v) => {
              e.preventDefault();
              const { action } = v;
              dispatch(updateActionStart({
                value:action,
                body:{ ...selectedAction }
              }));
            }}
          >
            
            <div className="mb-3">
              <AvField
                name="action"
                label={props.t("Action")}
                placeholder={props.t("Enter Action")}
                type="text"
                value = {actions}
                errorMessage={props.t("Enter valid action")}
                validate={{ required: { value: true } }}
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
  actions :state.dictionaryReducer.actions || [],
  id :state.dictionaryReducer.id,
  editSuccess:state.dictionaryReducer.editSuccess,
  disableEditButton : state.dictionaryReducer.disableEditButton
});
export default connect(mapStateToProps, null)(withTranslation()(MarkupsEdit));