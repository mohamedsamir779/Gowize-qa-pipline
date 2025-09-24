import { connect, useDispatch } from "react-redux";
import CustomTable from "../../../components/Common/CustomTable";
import React, { useState, useEffect } from "react";
import { getDepositsStart } from "../../../store/crypto/history/actions";
import { Button } from "reactstrap";
import { BigNumber } from "bignumber.js";
//i18n
import { withTranslation } from "react-i18next";
import { getAssetImgSrc } from "helpers/assetImgSrc";

function Deposits(props) {
  const [limit, setLimit] =  useState(5);
  const dispatch = useDispatch();

  // when the filter value changes it fetches data with the new filter
  useEffect(() => {
    dispatch(getDepositsStart({
      limit:limit,
      page:1,
      currency: props.filterObj?.currency,
      status: props.filterObj?.status,
      gateway: props.filterObj?.gateway,
      fromDate: props.filterObj?.fromDate,
      toDate: props.filterObj?.toDate
    }));
    
  }, [props.filterObj, limit]);
    
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
      formatter: (val)=>val?.amount?.$numberDecimal ? val.amount.$numberDecimal : val.amount
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
        <div className="balances__number">{val?.walletId?.amount?.$numberDecimal ? val.walletId.amount.$numberDecimal : val.walletId.amount}</div>
                
      </>
    },
    {
      text: props.t("Total Balance"),
      formatter: (val) => <>
        <div className="balances__number">{val.walletId ? 
          new BigNumber(val?.walletId?.amount?.$numberDecimal ? val.walletId.amount.$numberDecimal : val.walletId.amount ).plus(
            new BigNumber(val?.walletId.freezeAmount?.$numberDecimal ? val.walletId.freezeAmount.$numberDecimal : val.walletId.freezeAmount)).toString() : ""}</div>  
      </>
    }
  ];
   
  return (
    <React.Fragment>
      <CustomTable 
        columns = {columns} 
        rows={props.deposits}
        loading={props.depositLoading}
      />
      { props.depositsTotalDocs > limit &&
        <Button type="button" onClick = {()=>{
          if (props.depositsTotalDocs > limit){
            setLimit(preValue=>preValue + 5);
          }
                
        }} className='blue-gradient-color w-100'>{props.t("Load More")}</Button> 
      }
    </React.Fragment>
  );
}
const mapStateToProps = (state)=>(
  {
    deposits :state.crypto.historyReducer.deposits || [],
    depositsTotalDocs : state.crypto.historyReducer.depositsTotalDocs,
    depositLoading: state.crypto.historyReducer.depositLoading
  }
);
export default connect(mapStateToProps, null)(withTranslation()(Deposits)); 