import React, { useState, useEffect } from "react";
import {
  useDispatch,
} from "react-redux";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
  Container
} from "reactstrap";
import { convertToIB } from "store/client/actions";
import { withTranslation } from "react-i18next";
import Loader from "components/Common/TableLoader";

function ConvertToIB({ isIb, isLead, t, kyc, id, convertToIbDetails }) {
  const {
    loading,
  } = convertToIbDetails;
  const dispatch = useDispatch();

  const [linkClientModal, setLinkClientModal] = useState(false);

  const toggleModal = () => {
    setLinkClientModal(!linkClientModal);
  };

  useEffect(() => {
    if (convertToIbDetails.clear && linkClientModal){
      toggleModal();
    }
  }, [convertToIbDetails.clear]);

  const handleConfirm = () => {
    dispatch(convertToIB({ id }));
  };

  return (
    <React.Fragment >
      <button
        type="button"
        disabled={isLead}
        className="btn btn-primary waves-effect waves-light w-100 me-1"
        onClick={toggleModal}
      >
        {t("Convert To IB")}
      </button>
      <Modal isOpen={linkClientModal} toggle={toggleModal} centered={true}>
        <ModalHeader toggle={toggleModal}>
          {t("Convert Client To IB")}
        </ModalHeader>
        <ModalBody >
          <Container>
            <Row className="mb-3">
              {
                isIb ? (
                  <p>{t("This client is already an ib!")}</p>
                ) : (
                  kyc 
                    ? <Col md="12">
                      <h5>{t("Are you sure you want to convert this client to an IB?")}</h5>
                    </Col> : <Col md="12">
                      <p>{t("Please approve the kyc before converting the client to IB!")}</p>
                    </Col>
                )
              }
            </Row>
          </Container>
        </ModalBody>
        <ModalFooter>
          <Button onClick={toggleModal} color="secondary">
            {t("No")}
          </Button>
          {loading ? <Loader/> : (
            <Button onClick={handleConfirm} color="primary" disabled={isIb || !kyc}>
              {t("Yes")}
            </Button>
          )}
        </ModalFooter>
      </Modal>
    </React.Fragment >
  );
}

export default withTranslation()(ConvertToIB);