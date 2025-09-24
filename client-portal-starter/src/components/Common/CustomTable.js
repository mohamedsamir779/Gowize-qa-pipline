import React from "react";
import {
  Table, Thead, Tbody, Tr, Th, Td 
} from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
//i18n
import { withTranslation } from "react-i18next";
import TableLoader from "./TableLoader";

function CustomTable({ columns = [], rows = [], loading = false, ...props }) {
  return (<>
    <div className="table-rep-plugin custom-table" style={{ width: "100%" }}>
      <div
        className="table-responsive mb-0"
      >
        <Table
          borderless responsive className="text-center mb-0"        
        >
          <Thead >
            <Tr>
              {columns.map((column, index) => (
                <Th data-priority={index} key={index} className="color-primary text-center"> 
                  {column.text}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {loading && <TableLoader colSpan={4} />}
            {!loading && rows.map((row, rowIndex) => (
              <React.Fragment key={`$row-${rowIndex}`}>
                <Tr className="text-center shadow">
                  <Td></Td>
                  {columns.map((column, index) => {
                    return <Td key={`${rowIndex}-${index}`} style={{ verticalAlign: "middle" }}>
                      {column.formatter
                        ? column.formatter(row, rowIndex)
                        : row[column.dataField]}
                    </Td>;
                  })}
                </Tr>
                <Tr className="empty-row"></Tr>
              </React.Fragment>    
            ))}
            {!loading && rows.length === 0 && (
              <Tr>
                <Td colSpan={"100%"} className="text-center">{props.t("There are no records")}</Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </div>
    </div>
  </>);
}
export default withTranslation()(CustomTable); 