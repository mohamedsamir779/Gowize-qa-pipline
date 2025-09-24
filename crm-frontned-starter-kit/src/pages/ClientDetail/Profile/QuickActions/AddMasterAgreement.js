import React, { useState, useEffect } from "react";
import {
  useDispatch, useSelector
} from "react-redux";

import { withTranslation } from "react-i18next";
import { fetchProducts } from "store/actions";
import AddMasterIbModal from "pages/ClientDetail/Partnership/AddMasterIbModal";

function TransactionForm({ clientId, t }) {
  const dispatch = useDispatch();
  const { accountTypes } = useSelector((state) => state.tradingAccountReducer);
  const { products } = useSelector((state) => state.ibAgreements);

  const [linkClientModal, setLinkClientModal] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
  }, []);

  const toggleModal = () => {
    setLinkClientModal(!linkClientModal);
  };

  return (
    <React.Fragment >
      <button
        type="button"
        className="btn btn-primary waves-effect waves-light w-100 me-1"
        onClick={toggleModal}
      >
        {t("Add Master Agreement")}
      </button>
      <AddMasterIbModal
        show={linkClientModal}
        toggle={toggleModal}
        accountTypes={accountTypes}
        products={products}
        customerId={clientId}
      />
    </React.Fragment >
  );
}

export default withTranslation()(TransactionForm);