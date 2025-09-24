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
import { updateActionStart, updateMarkupStart } from "store/dictionary/actions";
function MarkupEdit(props){
  const { onClose, open, selectedMarkup = {} } = props;
  const dispatch = useDispatch();
  const { markups } = selectedMarkup;
  return (
    <React.Fragment >
      
      <Modal isOpen={open} toggle={onClose} centered={true}>
        <ModalHeader toggle={onClose} tag="h4">
          Edit Markup
        </ModalHeader>
        <ModalBody >
          <AvForm
            className='p-4'
            onValidSubmit={(e, v) => {
              e.preventDefault();
              const { markup } = v;
              dispatch(updateMarkupStart({
                value: markup,
                body:{ ...selectedMarkup }
              }));
            }}
          >
            
            <div className="mb-3">
              <AvField
                name="markup"
                label={props.t("Markup")}
                placeholder={props.t("Enter Markup")}
                type="text"
                value={markups}
                errorMessage={props.t("Enter valid markup")}
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
  markups :state.dictionaryReducer.markups || [],
  id :state.dictionaryReducer.id,
  editSuccess:state.dictionaryReducer.editSuccess,
  disableEditButton : state.dictionaryReducer.disableEditButton
});
export default connect(mapStateToProps, null)(withTranslation()(MarkupEdit));