
import React from "react";
import {
  Spinner
} from "reactstrap";
  
function AppLoader() {
  return (<React.Fragment>
    <div style={{
      height: "100vh",
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      display: "flex"
    }}>
      {/* <Spinner type="grow" className="ms-2" color="primary" /> */}
      <Spinner type="grow" className="ms-2" color="secondary" />
      <Spinner type="grow" className="ms-2" color="secondary" />
      <Spinner type="grow" className="ms-2" color="secondary" />
      <Spinner type="grow" className="ms-2" color="secondary" />
      <Spinner type="grow" className="ms-2" color="secondary" />
      <Spinner type="grow" className="ms-2" color="secondary" />

      {/* <Spinner type="grow" className="ms-2" color="success" />
      <Spinner type="grow" className="ms-2" color="danger" />
      <Spinner type="grow" className="ms-2" color="warning" />
      <Spinner type="grow" className="ms-2" color="info" />
      <Spinner type="grow" className="ms-2" color="light" />
      <Spinner type="grow" className="ms-2" color="dark" /> */}
    </div>
  </React.Fragment>);
}

export default AppLoader;
