import React, { useEffect, useState } from "react";
import { 
  useDispatch, 
  connect, 
  useSelector 
} from "react-redux";
import MetaTags from "react-meta-tags";
import { fetchDictionaryStart } from "store/dictionary/actions";
import {
  Card,
  CardBody,
  Col,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";
import classnames from "classnames";
import Deposits from "pages/Transactions/Crypto/Deposit";
import DepositsForex from "pages/Transactions/Forex/deposits/DepositForex";

function DepositsIndex() {
  const dispatch = useDispatch();
  useState(() => {
    dispatch(fetchDictionaryStart());
  }, []);
  const { profileMetaInfo = {} } = useSelector((state) => state.Profile);
  const toggle = (tab) => {
    if (activeTab !== tab) {
      setactiveTab(tab);
    }
  };

  const loadTabs = ({
    transactions: { depositDetails: { forex } = {} } = {},
  }) => [
    {
      tabId: "1",
      navLinkName: "Wallets",
      component: <Deposits />,
      hidden: !forex,
    },
    {
      tabId: "2",
      navLinkName: "Forex",
      component: <DepositsForex />,
      hidden: !forex,
    },
  ];

  const tabs = loadTabs(profileMetaInfo).filter((item) => !item.hidden);
  const [activeTab, setactiveTab] = useState(
    tabs.length > 0 ? tabs[0].tabId : ""
  );

  useEffect(() => {
    if (tabs.length > 0) {
      setactiveTab(tabs[0].tabId);
    }
  }, [profileMetaInfo]);

  return (
    <React.Fragment>
      <MetaTags>
        <title>Deposits</title>
      </MetaTags>
      <div className="page-content">
        <div className="container-fluid">
          <h2>Deposits</h2>
          <Row>
            <Col className="col-12">
              <Card>
                <CardBody>
                  <Nav tabs>
                    {tabs.map((tabItem) => (
                      <>
                        <NavItem>
                          <NavLink
                            style={{ cursor: "pointer" }}
                            className={classnames({
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
const mapStateToProps = (state) => ({
  loading: state.dictionaryReducer.loading || false,
  dictionary: state.dictionaryReducer.dictionary || [],
  error: state.dictionaryReducer.error,
});
export default connect(mapStateToProps, null)(DepositsIndex);
