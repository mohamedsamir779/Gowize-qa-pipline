import classNames from "classnames";
import CardWrapper from "components/Common/CardWrapper";
import TableLoader from "components/Common/TableLoader";
import { useEffect, useState } from "react";
import { useTranslation, withTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  Tbody, Th, Thead, Tr 
} from "react-super-responsive-table";
import {
  Button, ButtonGroup, Table
} from "reactstrap";
import { getClientAccountActivities } from "store/forex/ib/clients/actions";
import CustomPagination from "components/Common/CustomPagination";
import moment from "moment";


function TradingActivity(props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [positionsType, setPositionsType] = useState("open-positions");
  const state = useSelector(state=>state.forex.ib.clients.clientAccountActivity);
  const [sizePerPage, setSizePerPage] = useState(10);

  const loadClientAccountActivities = (page, limit)=>{
    if (!positionsType) return ;
    if (props.selectedTradingAccount){
      dispatch(getClientAccountActivities({
        tradingAccountId: props.selectedTradingAccount._id,
        type: positionsType,
        page,
        limit
      }));
    }
  };

  useEffect(()=>{
    if (props.selectedTradingAccount){
      loadClientAccountActivities(1, sizePerPage);
    }
  }, [props.selectedTradingAccount, positionsType, sizePerPage]);

  const togglePositionType = () => positionsType === "open-positions" ? setPositionsType("closed-positions") : setPositionsType("open-positions");

  const columns = positionsType === "open-positions" ? [
    {
      dataField: "Position",
      text: t("Position"),
    },
    {
      dataField:"Symbol",
      text:t("Symbol")
    },
    // {
    //   dataField: "Profit",
    //   text: t("Profit"),
    // },
    {
      dataField: "PriceOpen",
      text: t("PriceOpen"),
    },
    // {
    //   dataField: "Profit",
    //   text: t("Profit")
    // },
    {
      dataField: "CreatedTime",
      text: t("Created Time"),
      formatter: (row) => moment(row.TimeCreate ).format("DD-MM-YYYY HH:mm:ss")
    }
  ] : [
    {
      dataField: "Position",
      text: ("#"),
    },
    {
      dataField:"Symbol",
      text:t("Symbol")
    },
    {
      dataField: "Profit",
      text: t("Profit"),
    },
    // {
    //   dataField: "PriceOpen",
    //   text: t("Open Price"),
    // },
    {
      dataField: "PriceClose",
      text: t("Close Price"),
    },
    {
      dataField: "Volume",
      text: t("Volume"),
      formatter: (row) => row.Volume / 100000
    },
    {
      dataField: "CreatedTime",
      text: t("Created Time"),
      formatter: (row) => moment(row.TimeCreate /* * 1000*/).format("DD-MM-YYYY HH:mm:ss")
    }
  ];


  return ( 
    <>
      <CardWrapper className="nav-tab-custom shadow glass-card">
        <div className="d-flex justify-content-between">
          <h5 className="color-primary">{t("Trading Activities")}</h5>
          <ButtonGroup>
            <Button
              className={classNames("btn btn-light shadow-lg mx-1 border-0", {
                "text-white color-bg-btn": positionsType === "open-positions",
              })}
              onClick={togglePositionType}>
              {t("Open Trades")}
            </Button>
            <Button
              className={classNames("btn btn-light shadow-lg mx-1 border-0", {
                "text-white color-bg-btn": positionsType === "closed-positions",
              })}
              onClick={togglePositionType}>
              {t("Closed Trades")}
            </Button>
          </ButtonGroup>
        </div>
        {props.selectedTradingAccount ? <>
          {state.loading ? <TableLoader colSpan={12} className="m-auto"/> : state.docs.length > 0 ? 
            <div className="table-rep-plugin border rounded-3 mt-4">
              <div
                className="table-responsive mb-0"
                data-pattern="priority-columns"
              >
                <Table
                  id="tech-companies-1"
                  className="table table-hover"
                >
                  <Thead className="text-center table-light">
                    <Tr>
                      {columns.map((column, index) => (
                        <Th data-priority={index} key={index} className="color-primary">
                          {column.text}
                        </Th>
                      ))}
                    </Tr>
                  </Thead>
                  <Tbody style={{ textAlign: "center" }}>
                    {state.loading && <TableLoader colSpan={12} />}
                    {!state.loading && state.docs.length > 0 && state.docs.map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-bottom">
                        {columns.map((column, index) => (
                          <td key={`${rowIndex}-${index}`}>
                            {column.formatter
                              ? column.formatter(row, rowIndex)
                              : row[column.dataField]}
                          </td>
                        ))}
                      </tr>))}
                  </Tbody>
                </Table>
                <CustomPagination
                  {...state}
                  setSizePerPage={setSizePerPage}
                  sizePerPage={sizePerPage}
                  onChange={loadClientAccountActivities}
                  docs={state.docs}
                />
              </div>
            </div> : <p className="text-center m-3">{t("No Trading activities Available")}</p>}
        </> : <p className="text-center m-3">{t("No Trading activities Selected")}</p>}
      </CardWrapper>
    </> 
  );
}

export default withTranslation()(TradingActivity);