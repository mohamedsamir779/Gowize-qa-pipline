import React, { useState } from "react";
import {
  useDispatch, connect
} from "react-redux";

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
import ActionsTab from "./Actions.js/ActionsTab";
import CountriesTab from "./Countries/CountriesTab";
import CallStatusTab from "./CallStatus/CallStatusTab";
import ExchangesTab from "./Exchanges/ExchangesTab";
import { MetaTags } from "react-meta-tags";
import MarkupTab from "./Markups/MarkupTab";
import ProductsTab from "./Products/ProductsTab";
function DictionaryList() {
  const dispatch = useDispatch();
  useState(() => {
    dispatch(fetchDictionaryStart());
  }, []);
  const [activeTab, setactiveTab] = useState(1);
  const toggle = tab => {
    if (activeTab !== tab) {
      setactiveTab(tab);
    }
  };

  const tabBars = () => [
    {
      index: 1,
      name: "Actions",
      tab: <ActionsTab />,
    },
    {
      index: 2,
      name: "Exchanges",
      tab: <ExchangesTab />,
    },
    {
      index: 4,
      name: "Countries",
      tab: <CountriesTab />,
    },
    {
      index: 5,
      name: "Markups",
      tab: <MarkupTab />
    },
    {
      index: 6,
      name: "Products",
      tab: <ProductsTab />
    },
    {
      index: 3,
      name: "Call Statuses",
      tab: <CallStatusTab />,
    },
  ];

  return (
    <React.Fragment>
      <MetaTags>
        <title>
          Dictionaries
        </title>
      </MetaTags>
      <div className="page-content">
        <div className="container-fluid">
          <h2>Dictionary</h2>
          <Row>
            <Col className="col-12">
              <Card>

                <CardBody>
                  <Nav tabs>
                    {
                      tabBars().map((tabItem) => (
                        <NavItem key={tabItem.index}>
                          <NavLink
                            style={{ cursor: "pointer" }}
                            className={classnames({
                              active: activeTab === tabItem.index,
                            })}
                            onClick={() => {
                              toggle(tabItem.index);
                            }}
                          >
                            {tabItem.name}
                          </NavLink>
                        </NavItem>
                      ))
                    }
                  </Nav>

                  <TabContent activeTab={activeTab} className="p-3 text-muted">
                    {
                      tabBars().map((tabItem) => (
                        <TabPane tabId={tabItem.index} key={tabItem.index}>
                          <Row>
                            <Col sm="12">
                              {tabItem.tab}
                            </Col>
                          </Row>
                        </TabPane>
                      ))
                    }
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
export default connect(mapStateToProps, null)(DictionaryList);