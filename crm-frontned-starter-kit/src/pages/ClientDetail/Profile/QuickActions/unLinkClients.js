import React, { useState, useEffect } from "react";
import {
  useDispatch, useSelector
} from "react-redux";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import { withTranslation } from "react-i18next";
import { AvField, AvForm } from "availity-reactstrap-validation";
import { fetchReferrals, unlinkClients } from "store/client/actions";

function unLinkClients({ clientId, t }) {
  const dispatch = useDispatch();
  const { linking } = useSelector((state) => state.clientReducer);
  const { referrals } = useSelector((state) => state.clientReducer?.clientDetails);
  const [ownClients, setOwnClients] = useState([]);
  useEffect(() => {
    dispatch(fetchReferrals({
      type: "live",
      clientId: clientId
    }));
  }, [clientId]);

  const [linkClientModal, setLinkClientModal] = useState(false);

  useEffect(() => {
    if (referrals && referrals[0].childs ) {
      const children = referrals[0].childs;
      const ownClients = children.filter(client => !client?.childs || client?.childs?.length === 0);
      setOwnClients(ownClients.filter(client =>  !client?.fx?.isIb));
    }
  }, [referrals]);

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
        className="btn btn-primary waves-effect waves-light w-100 me-1"
        onClick={toggleModal}
      >
        {t("Unlink Clients")}
      </button>
      <Modal isOpen={linkClientModal} toggle={toggleModal} centered={true}>
        <ModalHeader toggle={toggleModal} tag="h4">
          {t("Unlink Clients")}
        </ModalHeader>
        <ModalBody >
          <AvForm
            className='px-4'
            onValidSubmit={(e, v) => {
              dispatch(unlinkClients(v));
            }}
          >
            {ownClients.length !== 0 ?
              <AvField
                multiple
                type="select"
                name="clientIds"
                label={t("Clients")}
              >
                {ownClients
                  .map(client => {
                    return <option key={client._id} value={client._id}>{client?.firstName} {client?.lastName}</option>;
                  })
                }
              </ AvField>
              : <h6 className="text-center">{t("No clients for this IB")}</h6>}
            {ownClients.length !== 0 && <div className='text-center mt-3'>
              <Button type="submit" color="primary">
                {t("Unlink")}
              </Button>
            </div>}
          </AvForm>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
}

export default withTranslation()(unLinkClients);