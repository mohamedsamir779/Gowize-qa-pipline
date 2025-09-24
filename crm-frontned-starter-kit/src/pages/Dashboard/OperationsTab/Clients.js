import React from "react";
// eslint-disable-next-line object-curly-newline
import { Card, CardBody, CardTitle, Row, Col } from "reactstrap";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import moment from "moment";

const ClientsStats = (props) => {
  return (
    <React.Fragment>
      <Card className="card-animate">
        <CardBody>
          <CardTitle className="color-primary">
            <h5 className="color-primary">{props.t("Clients")}</h5>
          </CardTitle>
          <Row className="col-card-same-height mt-5">
            <Col
              xl={6}
              xs={11}
              className="col d-flex align-items-center justify-content-center"
            >
              <Row>
                <Link to="/clients">
                  <Col sm={12} className="d-flex align-items-center">
                    <div className="circle-stat">
                      {props.clientsStats &&
                        props.clientsStats.assigned +
                          props.clientsStats.unAssigned}
                    </div>
                    {props.t("All")}
                  </Col>
                </Link>
                <Link
                  to={`/clients?fromDate=${moment()
                    .subtract(parseInt(props.newDays, 10), "days")
                    .format("YYYY/MM/DD")}`}
                >
                  <Col sm={12} className="d-flex align-items-center">
                    <div className="circle-stat">{props.clientsStats.new}</div>
                    {props.t("New")}
                  </Col>
                </Link>
              </Row>
            </Col>
            <Col xl={6} xs={12} className="col p-0">
              <Row>
                <Link to="/clients?assigne=Assigned">
                  <Col sm={12} className="d-flex align-items-center">
                    <div className="circle-stat">
                      {props.clientsStats.assigned}
                    </div>
                    {props.t("Assigned")}
                  </Col>
                </Link>
                <Link to="/clients?assigne=Unassigned">
                  <Col sm={12} className="d-flex align-items-center">
                    <div className="circle-stat">
                      {props.clientsStats.unAssigned}
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
  clientsStats: state.dashboardReducer.clientsStats || {},
  newDays: state.Profile.newDays || 7,
});

export default connect(mapStateToProps, null)(withTranslation()(ClientsStats));
