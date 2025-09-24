
import React from "react";

import {
  Spinner
} from "reactstrap";

function TableLoader(){
  return (<React.Fragment>
    <div className="text-center w-100">
      <Spinner className="ms-2" color="secondary" />
    </div>
    {/* <Spinner type="grow" className="ms-2" color="secondary" />
    <Spinner type="grow" className="ms-2" color="secondary" />
    <Spinner type="grow" className="ms-2" color="secondary" />
    <Spinner type="grow" className="ms-2" color="secondary" />
    <Spinner type="grow" className="ms-2" color="secondary" /> */}
  </React.Fragment>);
}
export default TableLoader;