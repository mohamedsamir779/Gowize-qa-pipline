/* eslint-disable object-property-newline */
import React, { useEffect, useState } from "react";
import MetaTags from "react-meta-tags";
import { useDispatch } from "react-redux";

import * as content from "content";
import {
  fetchCustomerCountriesStart,
  fetchTodosStart,
  fetchCustomerStatsStart,
  fetchRemindersStart,
} from "store/actions";

import {
  TabContent, TabPane, Nav, NavItem, NavLink
} from "reactstrap";

import SalesTab from "./SalesTab";
import classNames from "classnames";
import OperationsTab from "./OperationsTab";

const Dashboard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTodosStart({ page: 1, limit: 7 }));
    dispatch(fetchRemindersStart({ page: 1, limit: 5 }));
    dispatch(fetchCustomerCountriesStart({}));
    dispatch(fetchCustomerStatsStart({}));
    dispatch(fetchCustomerStatsStart({}));
  }, []);

  const [activeTab, setactiveTab] = useState("operations");

  const toggle = (tab) => {
    if (activeTab !== tab) {
      setactiveTab(tab);
    }
  };

  const tabs = [
    {
      tabId: "operations",
      navLinkName: "Operations",
      component: <OperationsTab />,
      hidden: false,
    },
    {
      tabId: "sales",
      navLinkName: "Sales",
      component: <SalesTab />,
      hidden: false,
    },
  ];

  return (
    <div className="page-content px-0">
      <MetaTags>
        <title>Dashboard | CRM Forex - {content.clientName}</title>
      </MetaTags>
      <Nav tabs className="ps-3">
        {tabs.map((tabItem) => (
          <>
            <NavItem>
              <NavLink
                style={{ cursor: "pointer" }}
                className={classNames({
                  active: activeTab === tabItem.tabId,
                })}
                onClick={() => {
                  toggle(tabItem.tabId);
                }}
              >
                {tabItem.navLinkName}
              </NavLink>
            </NavItem>
          </>
        ))}
      </Nav>
      <TabContent activeTab={activeTab} className="p-3 text-muted">
        {tabs.map((tabItem) => (
          <TabPane tabId={tabItem.tabId} key={tabItem.tabId}>
            {tabItem.component}
          </TabPane>
        ))}
      </TabContent>
    </div>
  );
};

export default Dashboard;