import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dropdown, DropdownItem, DropdownMenu, DropdownToggle 
} from "reactstrap";

function CustomDropDown({ dropdownItems = [], handleClick = () => { }, width, defaultValue = "", ...props }) {
  const [btnprimary1, setBtnprimary1] = useState(false);
  const [selected, setSelected] = useState(defaultValue);
  const { t } = useTranslation();
  return (
    <>
      {dropdownItems.length > 0 ? <Dropdown
        isOpen={btnprimary1}
        toggle={() => setBtnprimary1(!btnprimary1)}
        style={{ width }}
        {...props}
      >
        <DropdownToggle tag="button" className={"w-100 custom-dropdownitem"}>
          <span className="current">{selected}</span>
          {btnprimary1 ? <span className="mdi mdi-chevron-up fs-5" />
            : <span className="mdi mdi-chevron-down fs-5" />}
        </DropdownToggle>
        <DropdownMenu className="w-100 dropdown-menu-end">
          {dropdownItems.map((item, index) =>
            <DropdownItem
              key={index}
              className="w-100 custom-dropdownitem"
              style={selected === item.title ? { color: "blue" } : { color: "" }}
              onClick={() => {
                setSelected(item.title);
                handleClick(item);
              }}>
              <span className={"mdi mdi-check"} style={selected === item.title ? { display: "inline" } : { visibility: "hidden" }} />
              <span className="ms-2">{t(item.title)}</span>
            </DropdownItem>
          )}
        </DropdownMenu>

      </Dropdown> : <></>}
    </>

  );
}

export default CustomDropDown;