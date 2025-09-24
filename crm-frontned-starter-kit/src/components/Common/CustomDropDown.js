import React, { useState } from "react";
import {
  Dropdown, DropdownToggle, DropdownItem, DropdownMenu
} from "reactstrap";
import { withTranslation } from "react-i18next";
function CustomDropdown({ status, approve, reject, permission, ...props }) {
  const [isOpen, setIsOpen] = useState(false);
  const isDisabled = () => {
    if (status === "APPROVED") {
      return true;
    }
    else if (status === "REJECTED") {
      return true;
    }
    else {
      return false;
    }
  };
  return (
    <Dropdown disabled={isDisabled()}
      isOpen={isOpen}
      toggle={() => setIsOpen(!isOpen)}
      className={`"chat-noti-dropdown" ${!permission ? "d-none" : ""}`}
    >
      <DropdownToggle tag="i" className="text-muted" style={{ cursor: "pointer" }}>
        <i className="mdi mdi-dots-horizontal font-size-18" style={{ color: isDisabled() ? "lightgray" : "rgb(66, 65, 65)" }}></i>
      </DropdownToggle>
      <DropdownMenu className="dropdown-menu-end">
        <DropdownItem onClick={approve} href="#">{props.t("Approve")}</DropdownItem>
        <DropdownItem onClick={reject} href="#">{props.t("Reject")}</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
export default withTranslation()(CustomDropdown);