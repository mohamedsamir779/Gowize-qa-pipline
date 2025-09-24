import { connect, useDispatch } from "react-redux";
import CustomTable from "../../../components/Common/CustomTable";
import React, { useState, useEffect } from "react";
import { 
  getDepositsStart, 
  getWithdrawalsStart,
  // getConvertsStart
} from "../../../store/crypto/history/actions";
// import { getOrdersStart } from "../../store/orders/actions";
import { Button } from "reactstrap";
import { BigNumber } from "bignumber.js";
//i18n
import { withTranslation } from "react-i18next";
import { getAssetImgSrc } from "helpers/assetImgSrc";

function Transactions(props) {
  const [limit, setLimit] =  useState(5);
  const dispatch = useDispatch();

  const columns = [
    {
      text: props.t("Asset"),
      formatter: (val) => {
        const found = props.assets?.find((asset)=>asset.symbol === val?.walletId?.asset);
        return <div className="balances__company">
          <div className="balances__logo">
            <img src={getAssetImgSrc(found)} alt="symbol"></img>
          </div>
          <div className="balances__text">{val?.walletId?.asset ? val.walletId.asset : ""}</div>
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
      formatter: (val)=>val?.amount?.$numberDecimal ? val.amount.$numberDecimal : val.amount
    },
    {
      text: props.t("Gateway"),
      dataField: "gateway",
    },
    {
      text: props.t("Type"),
      dataField: "type",
      formatter: (val)=>val?.type
    },
    {
      text: props.t("Status"),
      dataField: "status",
    },
    {
      text: props.t("On Orders"),
      formatter: (val) => <>
        <div className="balances__number">{val?.walletId?.freezeAmount?.$numberDecimal ? val.walletId.freezeAmount.$numberDecimal : val.walletId.freezeAmount}</div>
      </>
    },
    {
      text: props.t("Available Balance"),
      formatter: (val) => <>
        <div className="balances__number">{val?.walletId?.amount?.$numberDecimal ? val.walletId.amount.$numberDecimal : val.walletId.amount}</div>    
      </>
    },
    {
      text: props.t("Total Balance"),
      formatter: (val) => 
        <div className="balances__number">{val.walletId ? 
          new BigNumber(val?.walletId?.amount?.$numberDecimal ? val.walletId.amount.$numberDecimal : val.walletId.amount ).plus(
            new BigNumber(val?.walletId.freezeAmount?.$numberDecimal ? val.walletId.freezeAmount.$numberDecimal : val.walletId.freezeAmount)).toString() : ""}</div>  
    }
  ];

  // when the filter value changes it fetches data with the new filter
  useEffect(() => {
    dispatch(getDepositsStart({
      limit: limit,
      page: 1,
      currency: props.filterObj?.currency,
      status: props.filterObj?.status,
      gateway: props.filterObj?.gateway,
      fromDate: props.filterObj?.fromDate,
      toDate: props.filterObj?.toDate
    }));
    dispatch(getWithdrawalsStart({
      limit: limit,
      page: 1,
      currency: props.filterObj?.currency,
      status: props.filterObj?.status,
      gateway: props.filterObj?.gateway,
      fromDate: props.filterObj?.fromDate,
      toDate: props.filterObj?.toDate
    }));
    // dispatch(getOrdersStart({
    //   limit:limit,
    //   page:1,
    //   side: props.filterObj?.side,
    //   status: props.filterObj?.status,
    //   type: props.filterObj?.type,
    //   fromDate: props.filterObj?.fromDate,
    //   toDate: props.filterObj?.toDate
    // }));
    // dispatch(getConvertsStart({
    //   limit:limit,
    //   page:1,
    //   fromAsset: props.filterObj?.fromAsset,
    //   toAsset: props.filterObj?.toAsset,
    //   fromDate: props.filterObj?.fromDate,
    //   toDate: props.filterObj?.toDate
    // }));

  }, [props.filterObj, limit]);

  return (
    <React.Fragment>
      {/* <CustomTable 
        columns={columns} 
        rows={[...props.deposits, ...props.withdrawals]}
        loading={props.depositLoading || props.withdrawalLoading}
      /> */}
      {
        props.depositsTotalDocs + props.withdrawalsTotalDocs > limit &&
        <Button 
          type="button"
          onClick = {() => {
            if (props.depositsTotalDocs + props.withdrawalsTotalDocs > limit){
              setLimit(limit + 5);
            }
          }}
          className="blue-gradient-color w-100">{props.t("Load More")}
        </Button>
        // <p className ="text-center h4">{props.t("There are no records")}</p>
      }
    </React.Fragment>

  );
}
const mapStateToProps = (state)=>(
  {
    deposits: state.crypto.historyReducer.deposits || [],
    withdrawals :state.crypto.historyReducer.withdrawals || [],
    withdrawalsTotalDocs : state.crypto.historyReducer.withdrawalsTotalDocs,
    depositsTotalDocs : state.crypto.historyReducer.depositsTotalDocs,
    depositLoading: state.crypto.historyReducer.depositLoading,
    withdrawalLoading: state.crypto.historyReducer.withdrawalLoading,
  }
);
export default connect(mapStateToProps, null)(withTranslation()(Transactions)); 