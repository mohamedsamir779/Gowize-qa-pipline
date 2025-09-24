import { connect, useDispatch } from "react-redux";
import CustomTable from "../../../components/Common/CustomTable";
import React, { useState, useEffect } from "react";
import { Button } from "reactstrap";
import { getWithdrawalsStart } from "../../../store/crypto/history/actions";
import { BigNumber } from "bignumber.js";
import { getAssetImgSrc } from "helpers/assetImgSrc";
import { withTranslation } from "react-i18next";

function Withdrawls(props) {
  const [limit, setLimit] =  useState(5);
  const dispatch = useDispatch();

  const columns = [
    {
      dataField: "favoriteIcon",
      text: ""
    },
    {
      text: props.t("Asset"),
      formatter: (val) => {
        const found = props.assets?.find((asset)=>asset.symbol === val?.walletId?.asset);
        return <div className="balances__company">
          <div className="balances__logo">
            <img src={getAssetImgSrc(found)} alt="symbol"></img>
          </div>
          <div className="balances__text">{val.walletId ? val.walletId.asset : ""}</div>
        </div>;},
    },
    {
      text: props.t("Date"),
      dataField: "createdAt",
      formatter: (item) => {
        let d = new Date(item.createdAt);
        d = `${d.toLocaleDateString()}, ${d.toLocaleTimeString()}`;
        return d;
      }
    },
    {
      text: props.t("Amount"),
      dataField: "amount",
      formatter: (val) => val?.amount?.$numberDecimal ? val.amount.$numberDecimal : val.amount
    },
    {
      text: props.t("Gateway"),
      dataField: "gateway",
    },
    {
      text: props.t("Status"),
      dataField: "status",
    },
    {
      text: props.t("On Orders"),
      formatter: (val) => <>
        <div className="balances__number">{val?.walletId.freezeAmount?.$numberDecimal ? val.walletId.freezeAmount.$numberDecimal : val.walletId.freezeAmount}</div>
      </>
    },
    {
      text: props.t("Available Balance"),
      formatter: (val) => <>
        <div className="balances__number">{val.walletId?.amount?.$numberDecimal ? val.walletId.amount.$numberDecimal : val.walletId.amount}</div>        
      </>
    },
    {
      text: props.t("Total Balance"),
      formatter: (val) => <>
        <div className="balances__number">{val.walletId ? 
          new BigNumber(val?.walletId?.amount?.$numberDecimal ? val.walletId.amount.$numberDecimal : val.walletId.amount ).plus(
            new BigNumber(val?.walletId?.freezeAmount?.$numberDecimal ? val.walletId.freezeAmount.$numberDecimal : val.walletId.freezeAmount)).toString() : ""}</div>   
      </>
    }
  ];

  // when the filter value changes it fetches data with the new filter
  useEffect(() => {
    dispatch(getWithdrawalsStart({
      limit:limit,
      page:1,
      currency: props.filterObj?.currency,
      status: props.filterObj?.status,
      gateway: props.filterObj?.gateway,
      fromDate: props.filterObj?.fromDate,
      toDate: props.filterObj?.toDate
    }));
  }, [props.filterObj, limit]);

  return (
    <React.Fragment>
      <CustomTable 
        columns={columns} 
        rows={props.withdrawals} 
        loading={props.withdrawalLoading}
      />
      {props.withdrawals.length > 0 &&
        <Button type="button" className='blue-gradient-color w-100' onClick={() => {
          if (props.withdrawalsTotalDocs > props.withdrawals.length) {
            setLimit(preValue => preValue + 5);
          }

        }}
        >{props.t("Load More")}</Button> 
      }
    </React.Fragment>
  );
}
const mapStateToProps = (state) => (
  {
    withdrawals: state.crypto.historyReducer.withdrawals || [],
    withdrawalsTotalDocs: state.crypto.historyReducer.withdrawalsTotalDocs,
    withdrawalLoading: state.crypto.historyReducer.withdrawalLoading,
  }
);
export default connect(mapStateToProps, null)(withTranslation()(Withdrawls)); 