import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { withTranslation } from "react-i18next";
import { AvForm } from "availity-reactstrap-validation";
import {
  Button, Col, Container, Row
} from "reactstrap";
import {
  fetchAgreements, fetchAccountTypes, fetchProducts, deleteIbAgreement
} from "store/actions";
import useModal from "hooks/useModal";
import DedicatedLinks from "./DedicatedLinks";
import AddMasterIbModal from "./AddMasterIbModal";
import AddSharedIbModal from "./AddSharedIbModal";
import AgreementDetails from "./AgreementDetails";
import EditMasterIbModal from "./EditMasterIbModal";
import DeleteModal from "components/Common/DeleteModal";
import Select from "react-select";
import EditSharedIbModal from "./EditSharedIbModal";
import { getMT5Markups } from "store/client/actions";

const Partnership = (props) => {
  const dispatch = useDispatch();

  const { _id, recordId, stages } = useSelector((state) => state.clientReducer?.clientDetails);
  const { accountTypes } = useSelector((state) => state.tradingAccountReducer);
  const markups = useSelector((state) => state.dictionaryReducer.markups);
  const { products, agreements, deleting } = useSelector((state) => state.ibAgreements);

  const [selectedAgreement, setSelectedAgreement] = useState({});

  useEffect(() => {
    dispatch(fetchAccountTypes({
      type: "LIVE",
    }));
    dispatch(fetchProducts());
  }, []);

  useEffect(() => {
    _id && dispatch(fetchAgreements({ customerId: _id }));
    dispatch(getMT5Markups({ clientId: _id }));
  }, [_id]);

  useEffect(() => {
    agreements && setSelectedAgreement(agreements[0]);
  }, [agreements]);
  const { layoutMode } = useSelector(state => state.Layout);

  const customStyles = {
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "#495057",
      padding: 0,
      paddingRight: "5px",
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      display: "none"
    }),
    control: (provided) => {
      if (layoutMode === "dark") {
        return {
          ...provided,
          backgroundColor: "#19283B",
          border: 0,
          boxShadow: "0 0.125rem 0.25rem #0B182F",
          color: "#adb5bd",
          height: "100%",
        };
      }
      return {
        ...provided,
        height: "100%",
      };
    },
    menu: (provided) => ({
      ...provided,
      backgroundColor: layoutMode === "dark" ? "#242632" : "white",
      color: layoutMode === "dark" ? "#adb5bd" : "#495057",
      zIndex: 3,
    }),
    option: (provided, state) => ({
      ...provided,
      display: state.isDisabled ? "none" : "flex",
      flexDirection: "row",
      alignItems: "center",
      color: layoutMode === "dark" ? "#adb5bd" : "#495057",
    }),
    singleValue: (provided) => {
      return {
        ...provided,
        flexDirection: "row",
        alignItems: "center",
        color: layoutMode === "dark" ? "#adb5bd" : "#495057",
      };
    },
  };
  const [showMasterIB, toggleMasterIB] = useModal();
  const [showEditMasterIB, toggleEditMasterIB] = useModal();
  const [showSharedIB, toggleSharedIB] = useModal();
  const [showEditSharedIB, toggleEditSharedIB] = useModal();
  const [deleteIb, toggleDeleteIb] = useModal();
  return (
    <Container fluid className="gx-4">
      <Row className="justify-content-between align-items-end">
        <Col md="6" className="d-flex align-items-end">
          {agreements.length > 0 && <>
            <AvForm className="w-50">
              <label>{props.t("Select Agreement")}</label>
              <Select
                styles={customStyles}
                name="agreement"
                value={{ label: selectedAgreement?.title }}
                options={agreements?.map(agreement => {
                  return {
                    label: agreement.title,
                    value: agreement,
                  };
                }
                )}
                onChange={(e) => setSelectedAgreement(e.value)}
              />
            </AvForm>
            <div className="ms-3">
              <Button color="link"
                className="mdi mdi-pencil font-size-22 pb-0"
                id="edittooltip"
                onClick={selectedAgreement?.isMaster ? toggleEditMasterIB : toggleEditSharedIB}
              ></Button>
              {selectedAgreement && <>
                <EditMasterIbModal
                  show={showEditMasterIB}
                  toggle={toggleEditMasterIB}
                  accountTypes={accountTypes}
                  customerId={_id}
                  products={products}
                  agreement={selectedAgreement}
                  markups={markups}
                />
                <EditSharedIbModal
                  show={showEditSharedIB}
                  toggle={toggleEditSharedIB}
                  accountTypes={accountTypes}
                  products={products}
                  agreement={selectedAgreement}
                  markups={markups}
                />
              </>}
              <Button color="link"
                className="mdi mdi-delete font-size-22 pb-0 text-danger"
                id="deletetooltip"
                onClick={toggleDeleteIb}
              ></Button>
              {<DeleteModal
                loading={deleting}
                onDeleteClick={() => {
                  dispatch(deleteIbAgreement({ id: selectedAgreement._id }));
                  toggleDeleteIb();
                }}
                show={deleteIb}
                onCloseClick={toggleDeleteIb}
              />}
            </div>
          </>}
        </Col>
        { stages?.ib?.partnershipAgreement && <Col md="6" className="text-end">
          <Button color="primary" className="me-3"
            onClick={toggleMasterIB}
          >{props.t("Add Master IB Agreement")}</Button>
          <AddMasterIbModal
            show={showMasterIB}
            toggle={toggleMasterIB}
            accountTypes={accountTypes}
            products={products}
            customerId={_id}
            markups={markups}
          />
          <Button color="primary"
            onClick={toggleSharedIB}
          >{props.t("Add Shared IB Agreement")}</Button>
          <AddSharedIbModal
            show={showSharedIB}
            toggle={toggleSharedIB}
            accountTypes={accountTypes}
            products={products}
            clientId={_id}
            markups={markups}
          />
        </Col>}
      </Row>
      <Row className="mt-4">
        <Col>
          <AgreementDetails agreement={selectedAgreement} accountTypes={accountTypes} />
        </Col>
        <Col>
          <DedicatedLinks parentRef={recordId} agRef={selectedAgreement?.recordId} />
        </Col>
      </Row>
    </Container>
  );
};

export default withTranslation()(Partnership);
