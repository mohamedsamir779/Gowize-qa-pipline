import React, { useState } from "react";
import {
  Dropdown, DropdownItem, DropdownMenu, DropdownToggle 
} from "reactstrap";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { useTranslation } from "react-i18next";

const TableDropDown = () => {
  const [drp_primary1, setDrp_primary1] = useState(false);
  const { t } = useTranslation();
  return (
    <div className="">
      <Dropdown
        isOpen={drp_primary1}
        toggle={() => setDrp_primary1(!drp_primary1)}
      >
        <DropdownToggle caret color='link'
        >
          <i className='bx bx-dots-vertical'></i>
        </DropdownToggle>
        <DropdownMenu
          end="true"
        >
          <DropdownItem header>
            {t("Header")}
          </DropdownItem>
          <DropdownItem>
            {t("Some Action")}
          </DropdownItem>
          <DropdownItem divider />
          <DropdownItem>
            {t("Foo Action")}
          </DropdownItem>
          <DropdownItem>
            {t("Bar Action")}
          </DropdownItem>
          <DropdownItem>
            {t("Quo Action")}
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default TableDropDown;