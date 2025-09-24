import TableLoader from "components/Common/TableLoader";
import React from "react";
import { withTranslation } from "react-i18next";
import {
  Tbody, Th, Thead, Tr 
} from "react-super-responsive-table";
import { Table } from  "reactstrap";

function DetailsTable(props) {
  const { t, isLoading, columns, rows, onRowClick } = props;
  return (
    <Table borderless responsive className="text-center mb-0">
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
        {isLoading && <TableLoader colSpan={12} />}
        {!isLoading && (rows.length > 0 ?  rows.map((row, rowIndex) => (
          <tr key={rowIndex} onClick={()=>{onRowClick(row)}} style={{ cursor:"pointer" }}>
            {columns.map((column, index) => (
              <td key={`${rowIndex}-${index}`}>
                {column.formatter
                  ? column.formatter(row, rowIndex)
                  : row[column.dataField]}
              </td>
            ))}
          </tr>)) : 
          <p className="text-center m-3">{t("No Clients Available")}</p>
        )}
      </Tbody>
    </Table>
  );
}

export default withTranslation()(DetailsTable);