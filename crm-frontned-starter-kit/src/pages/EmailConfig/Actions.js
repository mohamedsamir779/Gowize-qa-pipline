import React from "react";
import { Button } from "reactstrap";

export default function Actions({
  submitHandler,
  t,
  isTestEnabled,
  isMakeActiveEnabled,
}) {
  return (
    <div className="d-flex w-100 justify-content-around ">
      <Button color="primary" id="saveDetails" onClick={()=> submitHandler("save")}>{t("Save Details")}
      </Button>
      <Button className="btn btn-primary" disabled={!isTestEnabled} onClick={()=> submitHandler("test") } >{t("Test")}</Button>
      <Button color="success" disabled={!isMakeActiveEnabled} onClick={()=> submitHandler("active")} >{t("Make Active")}</Button>
    </div>
  );
}
