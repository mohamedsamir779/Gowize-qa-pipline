import React from "react";
import CardWrapper from "../../../../components/Common/CardWrapper";
import { Button } from "reactstrap";
import RadialChart from "../../../../components/ApexCharts/RadialChart";
import {
  useDispatch, useSelector
} from "react-redux";
import { toggleCurrentModal } from "../../../../store/actions";
import { withTranslation } from "react-i18next";
import Loader from "components/Common/Loader";

const WalletCard = props => {
  const dispatch = useDispatch();
  
  const wallets = useSelector(state => state.crypto.wallets);
  return (
    <CardWrapper className='mb-5'>
      {wallets.loading && <Loader/>}
      {!wallets.loading && (
        <>
          <RadialChart height="60%"></RadialChart>
          <div className='balance-card-text mb-3'>
            <p className='fs-5 mb-2'>{props.t("Total Balance")}</p>
            <img src="img/logo/bitcoin.png" alt="bitcoin"></img>
            <p>{props.t("Bitcoin (BTC)")}</p>
            <h3>{wallets.wallets && (wallets.wallets.reduce((total, wallet) => (total + wallet.btcValue || 0), 0)).toFixed(2)}</h3>
            <p>{wallets.wallets && (wallets.wallets.reduce((total, wallet) => (total + wallet.usdValue || 0), 0)).toFixed(2)} USD</p>
          </div>
        </>
      )}
      
      <div className="btn-group w-100 d-flex align-items-center justify-content-between" role="group" style={{
        flexWrap: "wrap",
        gap: "15px" 
      }}>
        <Button type="button" className='btn btn-danger' onClick={() => { 
          dispatch(toggleCurrentModal("selectWithdrawalMethodModal")); 
        }}>{props.t("Withdraw")}</Button>
        <Button type="button" className='btn btn-success' onClick={() => {
          dispatch(toggleCurrentModal("selectDepositMethodModal")); 
        }}>{props.t("Deposit")}</Button>
      </div>
      <Button type="button" className='blue-gradient-color w-100 mt-3' onClick={()=>{props.history.push("/quick-buy")}}>{props.t("Quick Buy")}</Button>
    </CardWrapper>
  );
};
export default withTranslation()(WalletCard); 