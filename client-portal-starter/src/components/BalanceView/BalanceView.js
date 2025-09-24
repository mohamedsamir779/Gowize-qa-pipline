import React from "react";

import {
  Button, Input, InputGroup, InputGroupText, Modal
} from "reactstrap";
//i18n
import { withTranslation } from "react-i18next";

function BalanceView({ isOpen, toggleOpen, ...props }) {
  return (<>
    <Modal
      isOpen={isOpen}
      toggle={toggleOpen}
      centered={true}
      size="lg"
      className='custom-modal'
    >
      <div className="modal-header">
        <button
          type="button"
          className="close btn btn-soft-dark waves-effect waves-light btn-rounded m-4"
          data-dismiss="modal"
          aria-label="Close"
          onClick={toggleOpen}
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
        <div className="d-flex justify-content-center mb-3">
          <div>
            <img src="img/logo/ethereum.png" alt="" width={50} height={50}></img>
          </div>
          <div className="ms-3">
            <div className="fs-3 fw-bold">
              {props.t("ETH Balance")}
            </div>
            <span>{props.t("Ethereum")}</span>
          </div>
        </div>
        <div className="text-center mb-4">
          <div className="positive fs-4">24.12345 {props.t("ETH")}</div>
          3,700.96 {props.t("USD")}
        </div>
        <div className="mb-3">
          <InputGroup>
            <InputGroupText className="custom-input-group-text">
              {props.t("Trading Account")}
            </InputGroupText>
            <Input className="form-control border-start-0 text-end" type="text" placeholder="0.25498465412315 BTC" />
          </InputGroup>
        </div>
        <div className="mb-3">
          <InputGroup>
            <InputGroupText className="custom-input-group-text">
              {props.t("Total Holdings")}
            </InputGroupText>
            <Input className="form-control border-start-0 text-end" type="text" placeholder="0.25498465412315  BTC " />
          </InputGroup>
        </div>
        <div className="text-center">
          <Button color="danger" className="w-lg waves-effect waves-light m-2">
            {props.t("Withdraw")}
          </Button>
          <Button color="success" className="w-lg waves-effect waves-light m-2">
            {props.t("Deposit")}
          </Button>
          <Button className="btn w-lg waves-effect waves-light blue-gradient-color m-2">
            {props.t("Convert")}
          </Button>
        </div>
      </div>
    </Modal>
  </>);
}
export default withTranslation()(BalanceView); 