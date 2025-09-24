import React from "react";
// eslint-disable-next-line object-curly-newline
import { Card, CardBody, CardTitle, Row, Col } from "reactstrap";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import moment from "moment";

const LeadsStats = (props) => {
  return (
    <React.Fragment>
      <Card className="card-animate">
        <CardBody>
          <CardTitle>
            <h5 className="color-primary">{props.t("Leads")}</h5>
          </CardTitle>

          <Row className="col-card-same-height mt-5">
            <Col
              xl={6}
              xs={12}
              className="col d-flex align-items-center justify-content-center"
            >
              <Row>
                <Link to="/leads">
                  <Col sm={12} className="d-flex align-items-center">
                    <div className="circle-stat">
                      {props.leadsStats &&
                        props.leadsStats.assigned + props.leadsStats.unAssigned}
                    </div>
                    {props.t("All")}
                  </Col>
                </Link>
                <Link
                  to={`/leads?fromDate=${moment()
                    .subtract(parseInt(props.newDays, 10), "days")
                    .format("YYYY/MM/DD")}`}
                >
                  <Col sm={12} className="d-flex align-items-center">
                    <div className="circle-stat">{props.leadsStats.new}</div>
                    {props.t("New")}
                  </Col>
                </Link>
              </Row>
            </Col>
            <Col xl={6} xs={12} className="col p-0">
              <Row>
                <Link to="/leads?assigne=Assigned">
                  <Col sm={12} className="d-flex align-items-center">
                    <div className="circle-stat">
                      {props.leadsStats.assigned}
                    </div>
                    {props.t("Assigned")}
                  </Col>
                </Link>
                <Link to="/leads?assigne=Unassigned">
                  <Col sm={12} className="d-flex align-items-center">
                    <div className="circle-stat">
                      {props.leadsStats.unAssigned}
                    </div>
                    {props.t("Unassigned")}
                  </Col>
                </Link>
              </Row>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};
const mapStateToProps = (state) => ({
  leadsStats: state.dashboardReducer.leadsStats || {},
  newDays: state.Profile.newDays || 7,
});

export default connect(mapStateToProps, null)(withTranslation()(LeadsStats));
