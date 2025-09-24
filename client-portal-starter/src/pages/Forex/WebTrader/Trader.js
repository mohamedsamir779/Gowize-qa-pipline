import classNames from "classnames";
import CardWrapper from "components/Common/CardWrapper";
import { lazy, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ButtonGroup, Col, Row, Table 
} from "reactstrap";
const ChartContainer = lazy(() => import("./ChartContainer"));

const assets = [
  {
    symbol:"EUR/USD",
    bid:"0.98989",
    ask:"0.898989",
  },
  {
    symbol:"EUR/USD",
    bid:"0.98989",
    ask:"0.898989"
  },
  {
    symbol:"EUR/USD",
    bid:"0.98989",
    ask:"0.898989"
  },
  {
    symbol:"EUR/USD",
    bid:"0.98989",
    ask:"0.898989"
  },
  {
    symbol:"EUR/USD",
    bid:"0.98989",
    ask:"0.898989"
  }
];

function Trader() {
  const { t } = useTranslation();
  const [customActiveTab, setcustomActiveTab] = useState("1");
  const toggleCustom = tab => {
    if (customActiveTab !== tab) {
      setcustomActiveTab(tab);
    }
  };
  return ( <div>
    <Row>
      <Col xs={12} xl={3} className="my-3">
        <CardWrapper className="glass-card">
          <div className="nav-tab-custom text-center">
            <ButtonGroup className="my-2 w-100">
              <button
                className={classNames("btn btn-light border-0 shadow-lg ", {
                  "btn-primary color-bg-btn text-white": customActiveTab === "1",
                })}
                onClick={() => {
                  toggleCustom("1");
                }}>
                {t("Symbol")}
              </button>
              <button
                className={classNames("btn btn-light border-0 shadow-lg", {
                  "color-bg-btn text-white": customActiveTab === "2",
                })}
                onClick={() => {
                  toggleCustom("2");
                }}>
                {t("Details")}
              </button>
            </ButtonGroup>
            
            <div className="table-responsive">
              <Table className="table mb-0">
                <thead>
                  <tr>
                    <th>{t("Symbol")}</th>
                    <th>{t("Bid")}</th>
                    <th>{t("Ask")}</th>
                  </tr>
                </thead>
                <tbody>
                  {assets.map((asset, index)=><tr key={index}>
                    <td>{t(asset.symbol)}</td>
                    <td>{t(asset.bid)}</td>
                    <td>{t(asset.ask)}</td>
                  </tr>)}
                </tbody>
              </Table>
            </div>
                
          </div>
        </CardWrapper>
      </Col>
        
      <Col xs={12} xl={9} className="my-3">
        <CardWrapper>
          <ChartContainer></ChartContainer>
        </CardWrapper>
      </Col>
    </Row>
  </div> );
}

export default Trader;