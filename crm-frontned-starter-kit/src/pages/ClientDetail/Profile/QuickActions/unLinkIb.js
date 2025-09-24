import React, { useState, useEffect } from "react";
import {
  useDispatch, useSelector
} from "react-redux";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { unlinkIb } from "store/client/actions";
import { withTranslation } from "react-i18next";

function unLinkIb({ clientId, isLead, t, link }) {
  const dispatch = useDispatch();
  const { linking } = useSelector((state) => state.clientReducer);

  const [linkClientModal, setLinkClientModal] = useState(false);

  const toggleModal = () => {
    setLinkClientModal(!linkClientModal);
  };

  useEffect(() => {
    if (linking && linkClientModal) {
      setLinkClientModal(false);
    }
  }, [linking]);

  return (
    <React.Fragment >
      <button
        type="button"
        disabled={isLead}
        className="btn btn-primary waves-effect waves-light w-100 me-1"
        onClick={toggleModal}
      >
        {t("Unlink IB")}
      </button>
      <Modal isOpen={linkClientModal} toggle={toggleModal} centered={true}>
        <ModalHeader toggle={toggleModal} tag="h4">
          {t("Unlink IB")}
        </ModalHeader>
        <ModalBody className="text-center" >
          <h5>{t("Are you sure?")}</h5>
          <h6>{`This will unlink ${link?.firstName} ${link?.lastName}`}</h6>
        </ModalBody>
        <ModalFooter>
          <Button type="submit" color="primary"
            onClick={() => {
              dispatch(unlinkIb({ clientId }));
            }}>
            {t("Yes")}
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
}

export default withTranslation()(unLinkIb);