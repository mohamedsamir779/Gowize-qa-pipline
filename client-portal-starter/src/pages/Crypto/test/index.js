import React, { useState } from "react";
import { Button } from "reactstrap";
import BalanceView from "../../../components/BalanceView/BalanceView";
import CryptoDeposit from "../../../components/Deposit/Crypto/CryptoDeposit";
// import FiatDeposit from "../../../components/Deposit/Fiat/FiatDeposit";
import Transfer from "../../../components/Convert/Convert";
import FiatWithdraw from "../../../components/Withdraw/Fiat/FiatWithdraw";
//i18n
import { withTranslation } from "react-i18next";

function Test(props) {
  const [cryptoDeposit, setCryptoDeposit] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [fiatDeposit, setFiatDeposit] = useState(false);
  const [fiatWithdraw, setfiatWithdraw] = useState(false);
  const [transfer, setTransfer] = useState(false);
  const [balanceView, setBalanceView] = useState(false);
  return (<>
    <div className="page-content text-center d-flex align-items-center justify-content-center flex-column" >
      <div>
        <Button className="btn btn-success my-4" onClick={() => { setCryptoDeposit(true) }}>{props.t("Test Crypto Deposit")}</Button>
      </div>
      <div>
        <Button className="btn btn-success my-4" onClick={() => { setFiatDeposit(true) }}> {props.t("Test Fiat Deposit")}</Button>
      </div>
      <div>
        <Button className="btn btn-success my-4" onClick={() => { setfiatWithdraw(true) }}>{props.t("Test Fiat Withdraw")}</Button>
      </div>
      <div>
        <Button className="btn btn-success my-4" onClick={() => { setTransfer(true) }}>{props.t("Test Transfer")}</Button>
      </div>
      <div>
        <Button className="btn btn-success my-4" onClick={() => { setBalanceView(true) }}>{props.t("Balance View")}</Button>
      </div>
    </div>
    <CryptoDeposit isOpen={cryptoDeposit} toggleOpen={() => {
      setCryptoDeposit(!cryptoDeposit);
    }}></CryptoDeposit>
    {/* <FiatDeposit isOpen={fiatDeposit} toggleOpen={() => {
      setFiatDeposit(!fiatDeposit);
    }}></FiatDeposit> */}
    <FiatWithdraw isOpen={fiatWithdraw} toggleOpen={() => {
      setfiatWithdraw(!fiatWithdraw);
    }}>
    </FiatWithdraw>
    <Transfer isOpen={transfer} toggleOpen={() => {
      setTransfer(!transfer);
    }}>
    </Transfer>
    <BalanceView isOpen={balanceView} toggleOpen={() => {
      setBalanceView(!balanceView);
    }}>

    </BalanceView>
  </>);
}
export default withTranslation()(Test); 