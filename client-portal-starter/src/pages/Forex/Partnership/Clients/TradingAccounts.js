import CardWrapper from "components/Common/CardWrapper";
import TableLoader from "components/Common/TableLoader";
import { useEffect } from "react";
import { useTranslation, withTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  Tbody, Th, Thead, Tr 
} from "react-super-responsive-table";
import {  Table } from "reactstrap";
import { getClientAccounts } from "store/forex/ib/clients/actions";


function TradingAccounts(props) {
  const { t } = useTranslation();
  const { clientAccounts, clientAccountsLoading } = useSelector(state=>state.forex.ib.clients);
  const dispatch = useDispatch();

  const loadClientAccounts = ()=>{
    if (props.selectedClient)
      dispatch(getClientAccounts({ 
        type: props.type.toUpperCase(),
        customerId: props.selectedClient?._id
      }));
  };

  useEffect(()=>{
    loadClientAccounts();
  }, [props.selectedClient]);

  const columns = [
    {
      dataField:"login",
      text:t("Account")
    },
    {
      dataField:"platform",
      text:t("platform"),
      formatter: (val)=> {return val.platform}
    },
    {
      dataField: "Assets",
      text: t("Assets"),
    },
    {
      dataField: "Balance",
      text: t("Balance"),
      formatter: (val)=> {return val.balance}
    },
    {
      dataField: "Margin",
      text: t("Margin"),
      formatter: (val)=> {return val.freeMargin}
    },
    {
      dataField: "Profit",
      text: t("Profit"),
      formatter: (val)=> {return val?.profit ?? 0}
    },
  ];

  return (
    <>
      <CardWrapper className="glass-card">
        <div className="d-flex justify-content-between pb-2">
          <h5 className="color-primary">{t("Trading Accounts")}</h5>
        </div>
        {props.selectedClient ? <>
          {clientAccountsLoading ? <TableLoader colSpan={12} className="m-auto"/> : clientAccounts.length > 0 ? 
            <div className="border rounded-3 mt-4">
              <Table borderless responsive className="text-center mb-0" >
                <Thead className="text-center table-light">
                  <Tr>
                    {columns.map((column, index) => (
                      <Th data-priority={index} key={index} className="color-primary">
                        {column.text}
                      </Th>
                    ))}
                  </Tr>
                </Thead>
                <Tbody className="text-center">
                  {clientAccountsLoading && <TableLoader colSpan={12} />}
                  {!clientAccountsLoading && clientAccounts.length > 0 && clientAccounts.map((row, rowIndex) => (
                    <tr key={rowIndex} className="border-top" onClick={()=>{
                      props.setSelectedTradingAccount(row);
                    }} style={{ cursor:"pointer" }}>
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
            </div> : <p className="text-center m-3">{t("No Clients Available")}</p>}
        </> : <p className="text-center m-3">{t("No Client Selected")}</p>}
      </CardWrapper>
    </>
  );
}

export default withTranslation()(TradingAccounts);