import React, { useState, useEffect } from "react";
import {
  useDispatch, useSelector
} from "react-redux";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  Row,
  Col
} from "reactstrap";
import { linkClient } from "store/client/actions";
import { AvForm } from "availity-reactstrap-validation";
import { withTranslation } from "react-i18next";
import Select from "react-select";
import { fetchAgreements } from "store/actions";
import AgreementDetails from "pages/ClientDetail/Partnership/AgreementDetails";
import SearchableClientIbSelect from "components/Common/SearchableClientIbSelect";
import CustomSelect from "components/Common/CustomSelect";

function TransactionForm({ clientId, t }) {
  const dispatch = useDispatch();
  const { linking } = useSelector((state) => state.clientReducer);
  const { agreements } = useSelector((state) => state.ibAgreements);
  const { accountTypes } = useSelector((state) => state.tradingAccountReducer);

  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedAgreement, setSelectedAgreement] = useState("");
  const [linkClientModal, setLinkClientModal] = useState(false);

  useEffect(() => {
    dispatch(fetchAgreements({ customerId: clientId }));
  }, []);

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
        {t("Link Client")}
      </button>
      <Modal isOpen={linkClientModal} toggle={toggleModal} centered={true}>
        <ModalHeader toggle={toggleModal} tag="h4">
          {t("Link Client")}
        </ModalHeader>
        <ModalBody >
          <AvForm
            className='p-4'
            onValidSubmit={(e, v) => {
              dispatch(linkClient({
                clientId: selectedClientId,
                parentId: clientId,
                agrementId: selectedAgreement._id
              }));
            }}
          >
            <Row className="mb-3">
              <Col md="12">
                <SearchableClientIbSelect
                  name="selectedClientId"
                  label="Clients"
                  type="CLIENT"
                  onChange={(e) => setSelectedClientId(e?.value)}
                />
              </Col>
              <Col className="mt-2" md="12">
                <Label>{t("Agreements")}</Label>
                <div>
                  <CustomSelect
                    placeholder={t("Select agreement")}
                    onChange={(e) => {
                      setSelectedAgreement(e.value);
                    }}
                    isSearchable={true}
                    options={agreements?.map((agr) => (
                      {
                        label: agr.title,
                        value: agr
                      }

                    ))}
                    classNamePrefix="select2-selection"
                  />
                </div>
              </Col>
              {selectedAgreement && <Col className="mt-3" md="12">
                <AgreementDetails agreement={selectedAgreement} accountTypes={accountTypes} />
              </Col>}
            </Row>
            <div className='text-center pt-3 p-2'>
              <Button type="submit" color="primary" className=""
                disabled={!selectedClientId || !selectedAgreement}
              >
                {t("Link")}
              </Button>
            </div>
          </AvForm>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
}

export default withTranslation()(TransactionForm);