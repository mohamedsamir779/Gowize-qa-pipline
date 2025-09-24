import React, { useState } from "react";
import classnames from "classnames";
import CustomDropDown from "./CustomDropDown";
//i18n
import { withTranslation } from "react-i18next";

function Widgets({ children, dropdownProps, className, ...props }) {
  const [activeTab, setActiveTab] = useState(0);
  const { setTab } = props;
  const toggle = tab => {
    if (activeTab !== tab) {
      setActiveTab(tab);
      setTab(tab);
    }
  };

  return (
    <div className={`widgets ${className}`}>
      <div className="widgets__sorting mb-3">
        <div className="widgets__variants">
          {props.tabs?.map((tab, index) => <span key={index} onClick={() => {
            toggle(index);
          }} className={classnames("widgets__link", {
            active: activeTab === index,
          })}>
            {/* { tab)} */}
            {props.t(tab)}
          </span>)}
        </div>
        <CustomDropDown {...dropdownProps}/>
      </div>
      {children}
    </div>
  );
}
export default withTranslation()(Widgets); 