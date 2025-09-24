
import React from "react";

import {
  Spinner
} from "reactstrap";

function Loader(){
  return (<React.Fragment>
    <div className="text-center w-100 mb-4">
      <Spinner className="ms-2 mt-3" color="secondary" />

      {/* <Spinner type="grow"  className="ms-2" color="secondary" />
      <Spinner type="grow"  className="ms-2" color="secondary" />
      <Spinner type="grow"  className="ms-2" color="secondary" />
      <Spinner type="grow"  className="ms-2" color="secondary" />
      <Spinner type="grow"  className="ms-2" color="secondary" />
      <Spinner type="grow"  className="ms-2" color="secondary" />
      <Spinner type="grow"  className="ms-2" color="secondary" /> */}
    </div>
  </React.Fragment>);
}
export default Loader;