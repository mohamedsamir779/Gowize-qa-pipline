import CardWrapper from "components/Common/CardWrapper";
import TableLoader from "components/Common/TableLoader";
import { useTranslation, withTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  Th, Thead, Tr 
} from "react-super-responsive-table";
import {
  Spinner,
  Table
} from "reactstrap";
import CustomPagination from "components/Common/CustomPagination";
import { useEffect, useState } from "react";
import { getIbDeposits } from "store/forex/ib/actions";

function RecentDeposits() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const state = useSelector(state=>state.forex.ib.transactions.deposits);
  const [sizePerPage, setSizePerPage] = useState(10);
  // const [type, setType] = useState("live");
  const loadDeposits = (page, limit) => { 
    dispatch(getIbDeposits({ 
      type:"DEPOSIT",
      status: "APPROVED",
      accountType: "LIVE",
      page,
      limit
    }));
  };
  const getStatusColor = (status) => {
    switch (String(status).toLowerCase()) {
      case "approved":
        return "color-green";
      case "rejected":
        return "color-red";
      default:
        return "";
    }
  };

  useEffect(()=>{
    loadDeposits(1, sizePerPage);
  }, [sizePerPage]);
  const columns = [
    {
      text: t("Client"),
      formatter: (val)=> `${val.customerId.firstName} ${val.customerId.lastName}`
    },
    {
      dataField: "gateway",
      text: t("Gateway"),
      formatter : (val)=> <>{val.gateway}</>
    },
    {
      dataField: "amount",
      text: t("Amount"),
      formatter : (val)=> <>{val.amount} {val.currency}</>
    },
    {
      dataField: "status",
      text: t("Status"),
      formatter : (val)=> <span className={`text-capitalize font-weight-bold ${getStatusColor(val?.status)}`}>{val.status}</span>
    },
  ];
  return (
    <>
      <CardWrapper className="accounts-tab shadow glass-card">
        {/* <div className="d-flex justify-content-between">
          <ButtonGroup>
            <Button
              className={classNames("btn btn-light border-0", {
                "text-white color-bg-btn": type === "live",
              })}
              onClick={() => {
                setType("live");
              }}>
              {t("Live clients")}
            </Button>
            <Button
              className={classNames("btn btn-light border-0", {
                "text-white color-bg-btn": type === "demo",
              })}
              onClick={() => {
                setType("demo");
              }}>
              {t("Demo clients")}
            </Button>
          </ButtonGroup>
        </div> */}
        <div className="d-flex justify-content-between pb-2 my-2">
          <h5 className="color-primary">{t("Recent Deposits")}</h5>
        </div>
        {state.loading ? <div className="d-flex align-items-center justify-content-center">
          <Spinner></Spinner>
        </div> : state?.docs?.length > 0 ? <div className="border border-bottom-0 rounded-3 mt-4">
          <Table borderless responsive className="text-center mb-0">
            <Thead className="text-center table-light  border-bottom">
              <Tr>
                {columns.map((column, index) => (
                  <Th data-priority={index} key={index} className="color-primary">
                    {column.text}
                  </Th>
                ))}
              </Tr>
            </Thead>
            <tbody className="text-center">
              {state.loading && <TableLoader colSpan={12} />}
              {!state.loading && state.docs.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-bottom">
                  {columns.map((column, index) => (
                    <td key={`${rowIndex}-${index}`}>
                      {column.formatter
                        ? column.formatter(row, rowIndex)
                        : row[column.dataField]}
                    </td>
                  ))}
                </tr>))}        
            </tbody>
          </Table>
          <div className="my-3">
            <CustomPagination
              {...state}
              setSizePerPage={setSizePerPage}
              sizePerPage={sizePerPage}
              onChange={loadDeposits}
            />
          </div>
        </div> : <>
          <div className="text-center my-4">
            {t("No Deposits available")}
          </div>
        </>}
      </CardWrapper>
    </>
  );
}

export default withTranslation()(RecentDeposits);