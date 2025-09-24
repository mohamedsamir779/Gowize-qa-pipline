import TableLoader from "components/Common/Loader";
import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  Tbody, Td, Th, Thead, Tr 
} from "react-super-responsive-table";
import {
  Button, DropdownItem, DropdownMenu, DropdownToggle, Spinner, Table, UncontrolledDropdown 
} from "reactstrap";
import { disable2FA } from "store/client/actions";

function Security(props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { loading, success } = useSelector(state=>state.clientReducer.disable2FA);
  const state = useSelector(state=>state.clientReducer.clientDetails);
  const { clientId } = useParams();
  
  const disable2fa = ()=>{
    dispatch(disable2FA({ id: clientId }));
  };
  const columns = [
    {
      text:"Name",
      dataField:"name"
    },
    {
      text:"Status",
      dataField:"status",
      formatter:(val)=> success ? <i className={"bx bx-x-circle"} style={{ fontSize: "1.5rem" }}></i> : <i className={`bx ${val.status ? "bx-check-circle" : "bx-x-circle"}`} style={{ fontSize: "1.5rem" }}></i>
    },
    {
      text:"Actions",
      dataField:"actions",
      formatter:(val) => {
        return val.actions.map((action, index)=> <UncontrolledDropdown key={index}>
          <DropdownToggle className="text-muted font-size-24" style={{ cursor:"pointer" }} tag="a">
            <i className="mdi mdi-dots-vertical"></i>
          </DropdownToggle>

          <DropdownMenu className="dropdown-menu-end">
            <DropdownItem to="#" disabled={action.disabled} onClick={action.onClick}>{action.title}</DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>);
      }
    }
  ];
  const tabs = [
    {
      name:"2FA",
      status: state?.settings?.twoFactorAuthEnabled,
      actions: [{
        title:"Disable 2FA",
        disabled: state?.settings?.twoFactorAuthEnabled ? false : true,
        onClick: ()=>{
          disable2fa();
        },
        loading: loading
      }]
    },
  ];

  return (<>
    <div className="table-rep-plugin">
      <div
        data-pattern="priority-columns"
      >
        <Table
          id="tech-companies-1"
          className="table"
        >
          <Thead className="text-center table-light" >
            <Tr>
              {columns.map((column, index) =>
                <Th data-priority={index} key={index}>
                  <span className="color-primary">{column.text}</span>
                </Th>
              )}
            </Tr>
          </Thead>
          <Tbody className="text-center" style={{
            fontSize: "13px",
            height:"100%",
            overflow:"hidden"
          }}>
            {props.loading && <TableLoader colSpan={4} />}
            {!props.loading && tabs.map((row, rowIndex) =>
              <tr key={rowIndex} >
                {columns.map((column, index) =>
                  <td key={`${rowIndex}-${index}`}>                     
                    {column.formatter ? column.formatter(row, rowIndex) : row[column.dataField]}
                  </td>
                )}
              </tr>
            )}
          </Tbody>
        </Table>
      </div>
    </div>
  </> );
}

export default Security;