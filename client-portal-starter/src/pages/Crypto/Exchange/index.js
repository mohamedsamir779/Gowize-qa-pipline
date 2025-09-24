import { useState } from "react";
// eslint-disable-next-line object-curly-newline
import { Container, Row, Col, Button } from "reactstrap";
import MetaTags from "react-meta-tags";
import { useTranslation, withTranslation } from "react-i18next";

import NewOrder from "./NewOrder";
import OrderBooks from "./OrderBooks";
import TradeHistory from "./TradeHistory";
import OrderHistory from "./OrderHistory";
import ChartContainer from "./ChartContainer";
import FeatherIcon from "feather-icons-react";

function Exchange(props) {
  // TODO: Select market based on default market dropdown value
  const [selectedMarket, setSelectedMarket] = useState("ETH/USDT");
  const [showNewOrder, setShowNewOrder] = useState(true);
  const [showTradeHistory, setShowTradeHistory] = useState(true);

  const { t } = useTranslation();
  const onMarketSelect = (market) => {
    setSelectedMarket(market);
  };

  return (
    <Container fluid className="page-content">
      <MetaTags>
        <title>{props.t("Exchange")}</title>
      </MetaTags>
      <Row className="d-lg-none gx-0 px-4 mt-3">
        <ul className="nav nav-tabs" role="tablist">
          <li className="nav-item">
            <a
              className="nav-link active"
              href="#chart"
              aria-controls="chart"
              data-toggle="tab"
            >
              {t("Charts")}
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              href="#order"
              aria-controls="order"
              data-toggle="tab"
            >
              {t("Order Book")}
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              href="#history"
              aria-controls="history"
              data-toggle="tab"
            >
              {t("Orders")}
            </a>
          </li>
        </ul>
      </Row>
      <Row className="gx-lg-2 px-lg-2 px-4">
        <Col
          md={12}
          lg={2}
          className={
            `mt-3 mt-lg-0 order-1 order-lg-0 d-flex ${showNewOrder ? "justify-content-end" : "justify-content-start"
            }`
          }
        >
          <Button
            onClick={() => setShowNewOrder(!showNewOrder)}
            color="transparent"
            className={
              `d-none d-lg-block ${showNewOrder
                ? "button-transition-right"
                : "button-transition-left"
              }`
            }
          >
            <FeatherIcon
              icon={`${showNewOrder ? "chevron-left" : "chevron-right"}`}
              className="icon-lg"
            />
          </Button>
        </Col>
        <Col md={12} lg={8} className="order-0 order-lg-1 mt-lg-5"></Col>
        <Col
          md={12}
          lg={2}
          className={
            `mmt-3 mt-lg-0 order-2 order-lg-2 d-flex ${showTradeHistory ? "justify-content-start" : "justify-content-end"
            }`
          }
        >
          <Button
            onClick={() => setShowTradeHistory(!showTradeHistory)}
            color="transparent"
            className={
              `d-none d-lg-block ${showTradeHistory
                ? "button-transition-left"
                : "button-transition-right"
              }`
            }
          >
            <FeatherIcon
              icon={`${showTradeHistory ? "chevron-right" : "chevron-left"}`}
              className="icon-lg"
            />
          </Button>
        </Col>
      </Row>
      <Row className="gx-lg-2 px-lg-2 px-4">
        <Col
          md={12}
          lg={2}
          className={
            `mt-3 mt-lg-0 order-1 order-lg-0 d-block animate-width ${showNewOrder ? "" : "hide-animated"
            }`
          }
        >
          <NewOrder handleMarketSelect={onMarketSelect} />
        </Col>
        <Col
          md={12}
          lg={
            !showNewOrder && !showTradeHistory
              ? 12
              : !showNewOrder || !showTradeHistory
                ? 10
                : 8
          }
          className={"order-0 order-lg-1 animate-width"}
        >
          <Row className="tab-content">
            <Col
              role="tabpanel"
              id="order"
              lg={3}
              className="pe-lg-0 mt-lg-0 tab-pane tab-pane-custom"
            >
              <OrderBooks selectedMarket={selectedMarket} />
            </Col>
            <Col
              role="tabpanel"
              id="chart"
              lg={9}
              className="mt-lg-0 tab-pane tab-pane-custom active"
            >
              <ChartContainer selectedMarket={selectedMarket} />
            </Col>
            <Col
              role="tabpanel"
              id="history"
              className="mt-lg-3 tab-pane-custom tab-pane"
            >
              <OrderHistory />
            </Col>
          </Row>
        </Col>
        <Col
          lg={2}
          className={
            `mmt-3 mt-lg-0 order-2 order-lg-2 d-block animate-width ${showTradeHistory ? "" : "hide-animated"
            }`
          }
        >
          <TradeHistory />
        </Col>
      </Row>
    </Container>
  );
}

export default withTranslation()(Exchange);
