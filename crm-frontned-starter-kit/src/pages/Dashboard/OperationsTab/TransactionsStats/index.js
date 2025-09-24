import { getTransactionStats } from "apis/dashboard";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Card, CardBody, CardTitle, CardSubtitle, Nav, NavItem, TabContent, TabPane, NavLink
} from "reactstrap";
import classNames from "classnames";
import Details from "./Details";

const TransactionsStats = () => {
  const { t } = useTranslation();
  const [status, setStatus] = useState(null);
  const [activeTab, setactiveTab] = useState("forex");

  const toggle = (tab) => {
    if (activeTab !== tab) {
      setactiveTab(tab);
    }
  };

  useEffect(async () => {
    const st = await getTransactionStats();
    setStatus(st);
  }, []);

  const tabs = [
    {
      tabId: "forex",
      navLinkName: "Forex",
      component: <Details status={status?.forex} showCredit={true}/>,
      hidden: false,
    },
    {
      tabId: "wallets",
      navLinkName: "Wallets",
      component: <Details status={status?.wallets} showCredit={false}/>,
      hidden: false,
    },
  ];


  return (
    <React.Fragment>
      <Card className="card-animate">
        <CardBody>
          <CardTitle className="color-primary">
            <h5>{t("Transactions")}</h5>
          </CardTitle>
          <CardSubtitle className="mb-3">
            {/* {t("Transactions Stats")} */}
          </CardSubtitle>
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
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default TransactionsStats;