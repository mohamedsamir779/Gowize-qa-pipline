
import React from "react";

import Loader from "./Loader";

import {
  Tr, Td
} from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

function TableLoader(){
  return (<Tr>
    <Td colSpan={"100%"} className="text-center">
      <Loader />
    </Td>
  </Tr>);
}
export default TableLoader;