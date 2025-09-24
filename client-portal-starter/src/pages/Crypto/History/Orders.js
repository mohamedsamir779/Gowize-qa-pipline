import React, { useState, useEffect } from "react";
import {
  connect, useDispatch, useSelector 
} from "react-redux";
import CustomTable from "../../../components/Common/CustomTable";
import { getOrdersStart } from "../../../store/crypto/orders/actions";
import { Button } from "reactstrap";
//i18n
import { withTranslation } from "react-i18next";
import { getAssetImgSrc } from "helpers/assetImgSrc";
function Orders(props) {
  const [limit, setLimit] = useState(10);
  const { assets } = useSelector(state=>state.assets);
  const dispatch = useDispatch();
    
  const columns = [
    {
      text: props.t("Symbol"),
      dataField: "symbol",
      formatter: (val)=>{
        const found = assets.find((asset)=>asset.symbol === val?.symbol?.split("/")[0]);
        return <>
          <img src={getAssetImgSrc(found)} width="25" height="25" className="me-2"></img>
          <span>{val.symbol}</span>
        </>;}
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
      text:  props.t("Type"),
      dataField: "type",
      formatter: (val)=>val.type
    },
    {
      dataField:"side",
      text: props.t("Side"),
      formatter: (val) => <>
        <div className="balances__number">{val.side}</div>
      </>
    },
    {
      text: props.t("Amount"),
      formatter: (val) => <>
        <div className="balances__number">{val?.amount?.$numberDecimal ? val.amount.$numberDecimal : val.amount}</div>
                
      </>
    },
    {
      dataField:"paramsData",
      text: props.t("Tp"),
      formatter: (val) => <>
        <div className="balances__number">{val.paramsData ? val.paramsData.tp : ""}</div>
            
      </>
    },
    {
      dataField:"paramsData",
      text: props.t("Sl"),
      formatter: (val) => <>
        <div className="balances__number">{val.paramsData ? val.paramsData.sl : ""}</div>
            
      </>
    },
    {
      dataField:"price",
      text: props.t("Price"),
      formatter: (val) => <>
        <div className="balances__number">{val?.price?.$numberDecimal ? val.price.$numberDecimal : val.price}</div>
            
      </>
    },
    {
      dataField:"status",
      text: props.t("Status"),
      formatter: (val) => <>
        <div className="balances__number">{val.status}</div>
            
      </>
    }
  ];

  // when the filter value changes it fetches data with the new filter
  useEffect(() => {
    dispatch(getOrdersStart({
      limit:limit,
      page:1,
      side: props.filterObj?.side,
      status: props.filterObj?.status,
      type: props.filterObj?.type,
      symbol: props.filterObj?.selectedMarket,
      fromDate: props.filterObj?.fromDate,
      toDate: props.filterObj?.toDate,
    }));
    
  }, [props.filterObj, limit]);

  return (
    <React.Fragment>
      <CustomTable 
        columns={columns} 
        rows={props.orders}
        loading={props.ordersLoading}
      />
      {props.orders.length > 0 &&
        <Button type="button" className='blue-gradient-color w-100' onClick = {()=>{
          if (props.ordersTotalDocs > props.orders.length){
            setLimit(preValue=>preValue + 5);
          } 
        }
        }
        >{props.t("Load More")}</Button>
      }
    </React.Fragment>
  
  );
}
const mapStateToProps = (state)=>(
  {
    orders: state.crypto.orders.orders || [],
    ordersTotalDocs : state.crypto.orders.ordersTotalDocs,
    ordersLoading: state.crypto.orders.loading,
  }
);
export default connect(mapStateToProps, null)(withTranslation()(Orders)); 