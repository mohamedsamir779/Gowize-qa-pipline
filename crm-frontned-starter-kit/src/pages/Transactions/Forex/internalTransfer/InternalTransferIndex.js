import React, { useState } from "react";
import { 
  connect, useSelector 
} from "react-redux";
import MetaTags from "react-meta-tags";
import {
  Card,
  CardBody,
  Col,
  Nav,
  NavItem,
  Row,
  TabContent,
  TabPane,
  NavLink,
} from "reactstrap";
import InternalTransfer from "./InternalTransfer";
import WalletInternalTransfer from "./WalletInternalTransfer";
import classNames from "classnames";

function InternalTransferIndex(){
  const { profileMetaInfo = {} } = useSelector((state) => state.Profile);
  const toggle = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };
  const loadTabs = ({
    transactions: { depositDetails: {  forex } = {} } = {},
  }) => [
    {
      tabId: "1",
      navLinkName: "Wallets",
      component: <WalletInternalTransfer />,
      // hidden: !forex,
    },
    {
      tabId: "2",
      navLinkName: "Forex",
      component: <InternalTransfer />,
      // hidden: !forex,
    },
  ];

  const tabs = loadTabs(profileMetaInfo).filter((tab) => !tab.hidden);
  const [activeTab, setActiveTab] = useState("1");
  return (
    <React.Fragment>
      <MetaTags>
        <title>
          Internal Transfers
        </title>
      </MetaTags>
      <div className="page-content"> 
        <div className="container-fluid">
          <h2>Internal Transfers</h2>
          <Row>
            <Col className="col-12">
              <Card>
                <CardBody>
                  <Nav tabs>
                    {tabs?.map((tabItem) => (
                      <NavItem key={tabItem.navLinkName}>
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
                    ))}
                  </Nav>
                  <TabContent activeTab={activeTab} className="p-3 text-muted">
                    {tabs.map((tabItem) => (
                      <>
                        <TabPane tabId={tabItem.tabId}>
                          <Row>
                            <Col sm="12">{tabItem.component}</Col>
                          </Row>
                        </TabPane>
                      </>
                    ))}
                  </TabContent>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  );
}
const mapStateToProps = (state)=>({
  loading: state.dictionaryReducer.loading || false,
  dictionary: state.dictionaryReducer.dictionary || [],
  error : state.dictionaryReducer.error,
});
export default connect(mapStateToProps, null)(InternalTransferIndex);