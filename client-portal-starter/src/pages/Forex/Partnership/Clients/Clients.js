import classNames from "classnames";
import CardWrapper from "components/Common/CardWrapper";
import DetailsTable from "./Details";
import { useEffect } from "react";
import { useTranslation, withTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  Button, ButtonGroup
} from "reactstrap";
import { getIbClients } from "store/forex/ib/clients/actions";
import { getIbDeposits, getIbWithdraws } from "store/actions";

function Clients({ type, setSelectedClient, ...props }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { clients, loading } = useSelector(state=>state.forex.ib.clients);
  const { deposits, withdraws } = useSelector(state => state.forex.ib.transactions);
  const {
    customActiveTab,
    toggleCustom,
  } = props;
  useEffect(() => {
    if (customActiveTab === "1") loadClients();
    else if (customActiveTab === "2" || customActiveTab === "3") loadTransactions();
  }, [customActiveTab, type]);

  const loadTransactions = () =>{
    if (type){
      if (customActiveTab === "2") dispatch(getIbDeposits({
        type: "DEPOSIT",
        accountType: `${type}`.toUpperCase(),
      }));
      else if (customActiveTab === "3") dispatch(getIbWithdraws({
        type: "WITHDRAW",
        accountType: `${type}`.toUpperCase(),
      }));
    }
  };
  
  const loadClients = () => {
    if (type)
      dispatch(getIbClients({
        type
      }));
  };

  const getSelectedColumn = (id) => {
    switch (id) {
      case "1":
        return [
          {
            dataField: "firstName",
            text: t("First Name"),
            formatter : (val)=> <>{val.firstName}</>
          },
          {
            dataField: "lastName",
            text: t("Last Name"),
            formatter : (val)=> <>{val.lastName}</>
          },
          {
            dataField: "email",
            text: t("Email"),
            formatter : (val)=> <>{val.email}</>
          },
          {
            dataField: "phone",
            text: t("Phone"),
            formatter : (val)=> <>{val?.phone}</>
          },
          {
            dataField:"",
            formatter:()=> <Button className="color-bg-btn border-0">{t("View")}</Button>
            
          }
        ];
      case "2":
      case "3": 
        return [
          {
            dataField: "name",
            text: t("Name"),
            formatter: (val)=> `${val.customerId.firstName} ${val.customerId.lastName}`
          },
          {
            dataField: "account",
            text: t("Account"),
            formatter: (val) => <>{val.tradingAccountId.login}</>
          },
          {
            dataField: "type",
            text: t("Type"),
            formatter: (val) => <>{val.type}</>
          },
          {
            dataField: "createdAt",
            text: t("Date Created"),
            formatter: (val) => {
              let d = new Date(val.createdAt);
              d = `${d.toLocaleDateString()}, ${d.toLocaleTimeString()}`;
              return d;
            }
          },
          {
            dataField: "transactionId",
            text: t("Transaction Id"),
            formatter: (val) => <>{val._id}</>
          },
          {
            dataField: "gateway",
            text: t("Mode"),
            formatter: (val) => <>{val.gateway}</>
          },
          {
            dataField: "amount",
            text: t("Amount"),
            formatter: (val) => <>{val.amount}</>
          },
          {
            dataField: "status",
            text: t("Status"),
            formatter: (val) => <>{val.status}</>
          },
        ];
      default : 
        return [];
    }
  };

  const getSelectedRow = (id) =>{
    switch (id) {
      case "1":
        return clients;
      case "2":
        return deposits.docs || [];
      case "3":
        return withdraws.docs || [];
      default:
        return [];
    }
  };

  const getLoadingFor = (id) =>{
    switch (id) {
      case "1":
        return loading;
      case "2":
        return deposits.loading;
      case "3":
        return withdraws.loading;
      default:
        return false;
    }
  };
  const getRowClickHandler = (id) =>{
    switch (id) {
      case "1":
        return setSelectedClient;
      default :
        return ()=>{};
    }
  };
  
  const selectedColumn = getSelectedColumn(customActiveTab);
  const selectedRow = getSelectedRow(customActiveTab);
  const isLoading = getLoadingFor(customActiveTab);
  const rowHandler = getRowClickHandler(customActiveTab);

  return ( 
    <>
      <CardWrapper className="nav-tab-custom glass-card shadow">
        <div className="d-flex justify-content-between">
          <h5 className="color-primary">{t("Clients")}</h5>
          {type === "live" &&
          <ButtonGroup>
            <Button
              className={classNames("btn btn-light shadow-lg border-0", {
                "text-white color-bg-btn": customActiveTab === "1",
              })}
              onClick={() => {
                toggleCustom("1");
              }}>
              {t("All Clients")}
            </Button>
            {/* <Button
              className={classNames("btn btn-light shadow-lg mx-1 border-0", {
                "text-white color-bg-btn": customActiveTab === "2",
              })}
              onClick={() => {
                toggleCustom("2");
              }}>
              {t("Deposit")}
            </Button>
            <Button
              className={classNames("btn btn-light border-0 shadow-lg mx-1", {
                "text-white color-bg-btn": customActiveTab === "3",
              })}
              onClick={() => {
                toggleCustom("3");
              }}>
              {t("Withdrawal")}
            </Button> */}
          </ButtonGroup>}
        </div>
        {/* filter */}
        {/* <div className="pt-3">
          <Filter />
        </div> */}
        <div className="border rounded-3 mt-4">
          <DetailsTable isLoading={isLoading} columns={selectedColumn} rows={selectedRow} onRowClick={rowHandler} />
        </div>
      </CardWrapper>
    </> 
  );
}

export default withTranslation()(Clients);