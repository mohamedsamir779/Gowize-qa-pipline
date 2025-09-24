import React, { useState, useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { Button } from "reactstrap";

//i18n
import { withTranslation } from "react-i18next";
import CustomTable from "../../../components/Common/CustomTable";
import { getConvertsStart } from "../../../store/crypto/history/actions";
import { getAssetImgSrc } from "helpers/assetImgSrc";

function Orders(props) {
  const dispatch = useDispatch();
  const [limit, setLimit] = useState(5);

  const columns = [
    {
      dataField: "",
      text: ""
    },
    {
      text: props.t("From asset"),
      dataField: "toAsset",
      formatter:(val)=>{
        const found = props.assets?.find((asset)=>asset.symbol === val.fromAsset);
        return <>
          <div className="balances__company">
            <div className="balances__logo">
              <img src={getAssetImgSrc(found)} alt="symbol"></img>
            </div>
            <div className="balances__text">{val.fromAsset ? val.fromAsset : ""}</div>
          </div></>;
      }
    },
    {
      text: props.t("To asset"),
      dataField: "toAsset",
      formatter:(val)=>{
        const found = props.assets?.find((asset)=>asset.symbol === val.toAsset);
        return <>
          <div className="balances__company">
            <div className="balances__logo">
              <img src={getAssetImgSrc(found)} alt="symbol"></img>
            </div>
            <div className="balances__text">{val.toAsset ? val.toAsset : ""}</div>
          </div></>;
      }
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
      text: props.t("From Amount"),
      dataField: "amount",
      formatter: (item) =>(
        item.amount ? item.amount.$numberDecimal : "-"
      )
    },
    {
      text: props.t("To Amount"),
      dataField: "toAmount",
      formatter: (item) =>(
        item.toAmount ? item.toAmount.$numberDecimal : "-"
      )
    },
    {
      text: props.t("Status"),
      dataField: "status",
    }
  ];

  // when the filter value changes it fetches data with the new filter
  useEffect(() => {
    dispatch(getConvertsStart({
      limit:limit,
      page:1,
      fromAsset: props.filterObj?.fromAsset,
      toAsset: props.filterObj?.toAsset,
      status: props.filterObj?.status,
      fromDate: props.filterObj?.fromDate,
      toDate: props.filterObj?.toDate,
    }));
    
  }, [props.filterObj, limit]);

  return (
    <React.Fragment>
      <CustomTable 
        columns={columns} 
        rows={props.converts} 
        loading={props.convertLoading}
      />
      {
        props.converts?.length > 0 
          &&
          <Button 
            type="button" 
            className='blue-gradient-color w-100' 
            onClick={() => {
              if (props.totalDocs > props.converts?.length) {
                setLimit(preValue => preValue + 5);
              }
            }}
          >
            {props.t("Load More")}
          </Button> 
      }
    </React.Fragment>
  );
}

const mapStateToProps = (state)=>(
  {
    converts: state.crypto.historyReducer.converts,
    totalDocs : state.crypto.historyReducer.totalDocs,
    convertLoading: state.crypto.historyReducer.loading,
  }
);

export default connect(mapStateToProps, null)(withTranslation()(Orders)); 