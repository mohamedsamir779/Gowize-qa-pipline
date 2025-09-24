import React from "react";
import {
  Card, CardBody, Col, Row
} from "reactstrap";
import ReactApexChart from "react-apexcharts";

import { WidgetsData } from "common/data/dashboard";
import CountUp from "react-countup";

const options = {
  chart: {
    height: 50,
    type: "line",
    toolbar: { show: false },
  },
  colors: ["#5156be"],
  stroke: {
    curve: "smooth",
    width: 2,
  },
  xaxis: {
    labels: {
      show: false
    },
    axisTicks: {
      show: false
    },
    axisBorder: {
      show: false
    }
  },
  yaxis: {
    labels: {
      show: false
    }
  },
  tooltip: {
    fixed: {
      enabled: false
    },
    x: {
      show: false
    },
    y: {
      title: {
        formatter: function (seriesName) {
          return "";
        }
      }
    },
    marker: {
      show: false
    }
  }
};

const SalesTargetStats = () => {
  return (
    <React.Fragment>
      <Row>
        {(WidgetsData || []).map((widget, key) => (
          <Col xl={3} md={6} key={key}>
            <Card className="card-animate">
              <CardBody>
                <Row className="align-items-center">
                  <Col xs={6}>
                    <span className="text-muted mb-3 lh-1 d-block text-truncate">{widget.title}</span>
                    <h4 className="mb-3">
                      {widget.isDoller === true ? "$" : ""}
                      <span className="counter-value">
                        <CountUp
                          start={0}
                          end={widget.price}
                          duration={12}
                        />
                        {widget.postFix}
                      </span>
                    </h4>
                  </Col>
                  <Col xs={6}>
                    <ReactApexChart
                      options={options}
                      series={[{ data: [...widget["series"]] }]}
                      type="line"
                      className="apex-charts"
                      dir="ltr"
                    />
                  </Col>
                </Row>
                <div className="text-nowrap">
                  <span className={"badge badge-soft-" + widget.statusColor + " text-" + widget.statusColor}>
                    {widget.rank}
                  </span>
                  <span className="ms-1 text-muted font-size-13">Since last week</span>
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    
    </React.Fragment>
  );
};

export default SalesTargetStats;