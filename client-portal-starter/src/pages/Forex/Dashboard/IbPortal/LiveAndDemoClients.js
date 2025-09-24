import classNames from "classnames";
import CardWrapper from "components/Common/CardWrapper";
import TableLoader from "components/Common/TableLoader";
import { useEffect, useState } from "react";
import { useTranslation, withTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  Th, Thead, Tr 
} from "react-super-responsive-table";
import {
  Button, ButtonGroup, Spinner, Table
} from "reactstrap";
import { getIbClients } from "store/forex/ib/clients/actions";


function Accounts() {
  const { t } = useTranslation();
  const [customActiveTab, setCustomActiveTab] = useState("1");
  const [type, setType] = useState("live");
  const { clients, loading } = useSelector(state=>state.forex.ib.clients);
  const dispatch = useDispatch();

  useEffect(()=> {
    dispatch(getIbClients({ type }));
  }, [type]);

  const toggleCustom = tab => {
    if (customActiveTab !== tab) {
      setCustomActiveTab(tab);
    }
  };

  const columns = [
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
  ];
  
  return ( 
    <>
      <CardWrapper className="accounts-tab shadow glass-card">
        <div className="d-flex justify-content-between">
          <ButtonGroup>
            <Button
              className={classNames("btn btn-light border-0", {
                "text-white color-bg-btn": customActiveTab === "1",
              })}
              onClick={() => {
                toggleCustom("1");
                setType("live");
              }}>
              {t("Live clients")}
            </Button>
            <Button
              className={classNames("btn btn-light border-0", {
                "text-white color-bg-btn": customActiveTab === "2",
              })}
              onClick={() => {
                toggleCustom("2");
                setType("demo");
              }}>
              {t("Demo clients")}
            </Button>
          </ButtonGroup>
        </div>
        {loading ? <div className="d-flex align-items-center justify-content-center">
          <Spinner></Spinner>
        </div> : clients.length > 0 ? <div className="border rounded-3 mt-4">
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
            <tbody className="text-center">
              {loading && <TableLoader colSpan={12} />}
              {!loading && clients.map((row, rowIndex) => (
                <tr key={rowIndex}>
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
        </div> : <>
          <div className="text-center my-4">
            {t(`No ${type} clients available`)}
          </div>
        </>}
        
      </CardWrapper>
    </> 
  );
}

export default withTranslation()(Accounts);