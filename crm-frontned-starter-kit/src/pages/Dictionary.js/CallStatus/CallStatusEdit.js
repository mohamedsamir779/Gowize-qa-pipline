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
import { updateCallStatusStart } from "store/dictionary/actions";
function CallStatusEdit(props) {
  const { open, onClose, selectedCallStatus = "" } = props;
  const dispatch = useDispatch();
  const callStatus = selectedCallStatus;

  return (
    <React.Fragment >
      <Modal isOpen={open} toggle={onClose} centered={true}>
        <ModalHeader toggle={onClose} tag="h4">
          {props.t("Edit Call Status")}
        </ModalHeader>
        <ModalBody >
          <AvForm
            className='p-4'
            onValidSubmit={(e, v) => {
              e.preventDefault();
              const { newCallStatus } = v;
              dispatch(updateCallStatusStart({
                body: { callStatus: selectedCallStatus },
                value: newCallStatus
              }));
            }}
          >

            <div className="mb-3">
              <AvField
                name="newCallStatus"
                label={props.t("Call Status")}
                placeholder={props.t("Enter Call Status")}
                type="text"
                value={callStatus}
                validate={{ required: { value: true } }}
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
            {props.error}
          </UncontrolledAlert>}
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
}
const mapStateToProps = (state) => ({
  error: state.dictionaryReducer.error,
  disableEditButton: state.dictionaryReducer.disableEditButton
});
export default connect(mapStateToProps, null)(withTranslation()(CallStatusEdit));