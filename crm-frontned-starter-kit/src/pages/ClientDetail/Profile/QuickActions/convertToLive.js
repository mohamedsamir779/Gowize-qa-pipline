
import React, { useEffect } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from "reactstrap";
import Loader from "components/Common/TableLoader";
import {
  useDispatch, useSelector,
} from "react-redux";
import { convertToClientStart, fetchClientDetails } from "store/client/actions";

export default function ConvertToLive({ clientId, isDisabled, open, setOpen }) {

  const toggleModal = () => setOpen(!open);
  const { loading, clear } = useSelector((state) => state.clientReducer.convertToLive);

  if (isDisabled) return null;

  const dispatch = useDispatch();

  const handleConfirm = () => {
    dispatch(convertToClientStart({ clientId }));
  };

  useEffect(() => {
    if (clear && open){
      toggleModal();
      dispatch(fetchClientDetails(clientId));
    }
  }, [clear]);
  

  return (
    <React.Fragment>
      <button 
        type="button" 
        className="btn btn-primary waves-effect waves-light w-100 me-1"
        onClick={toggleModal}
      >
        Convert to Live
      </button>
      <Modal isOpen={open} toggle={toggleModal} centered={true}>
        <ModalHeader toggle={toggleModal}>
            Convert to Live
        </ModalHeader>
        <ModalBody>
          <div className="d-flex gap-3 d-flex flex-column align-items-center" style={{
            textAlign: "center"
          }}>
            <h4>Are you sure you want to convert this client to live?</h4>
          </div>
        </ModalBody>
        <ModalFooter>
          {
            loading ? <Loader /> : (
              <React.Fragment>
                <Button color="primary" onClick={handleConfirm}>
                  Confirm
                </Button>
              </React.Fragment>
            )
          }
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
}