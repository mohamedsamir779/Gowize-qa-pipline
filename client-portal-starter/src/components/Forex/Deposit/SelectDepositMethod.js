import { useTranslation } from "react-i18next";
import { Modal } from "reactstrap";
import DepositTabs from "./DepositTabs";

function SelectDepositMethod({ isOpen, toggle }) {
  const { t } = useTranslation();
  return ( <>
    <Modal
      isOpen={isOpen}
      toggle={() => {
        toggle();
      }}
      centered={true}
    >
      <div className="modal-header">
        <h5 className="modal-title mt-0">{t("Deposit")}</h5>
        <button
          type="button"
          onClick={() => {
            toggle(false);
          }}
          className="close"
          data-dismiss="modal"
          aria-label="Close"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
        <DepositTabs></DepositTabs>
      </div>
    </Modal>
  </> );
}

export default SelectDepositMethod;