import React from "react";
import { connect } from "react-redux";
import {
  Row, Col, Card, CardBody, 
  CardTitle, CardHeader
} from "reactstrap";
import {
  Table, Thead, Tbody, Tr, Th, Td
} from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

// i18n
import { withTranslation } from "react-i18next";

function YesNoIcon ({ status }) {
  return (status
    ? <i className="bx bx-check-circle" style={{ fontSize: "1.5rem" }} />
    : <i className="bx bx-x-circle" style={{ fontSize: "1.5rem" }} />
  );
}

function Stages(props) {
  const { stages } = props;
  return (
    <React.Fragment>
      <div className="">
        <div className="container-fluid">
          <Row>
            <Col className="col-12">
              <Card>
                <CardHeader className="d-flex justify-content-between  align-items-center">
                  <CardTitle className="color-primary">
                    {props.t("Individual Stage")}
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <div className="table-rep-plugin">
                    <div
                      className="table-responsive mb-0"
                      data-pattern="priority-columns"
                    >
                      <Table
                        id="tech-companies-1"
                        className="table  table-hover "
                      >
                        <Thead className="text-center table-light " >
                          <Tr className="color-primary">
                            <Th >{"Submit Profile"}</Th>
                            <Th >{"KYC Uploaded"}</Th>
                            <Th >{"KYC Rejected"}</Th>
                            <Th >{"KYC Approved"}</Th>
                            <Th >{"Deposit"}</Th>
                            <Th >{"Start Trading"}</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          <Tr>
                            <Td className="text-center"><YesNoIcon status={ stages.individual && stages.individual.submitProfile } /></Td>
                            <Td className="text-center"><YesNoIcon status={ stages.kycUpload } /></Td>
                            <Td className="text-center"><YesNoIcon status={ stages.kycRejected } /></Td>
                            <Td className="text-center"><YesNoIcon status={ stages.kycApproved } /></Td>
                            <Td className="text-center"><YesNoIcon status={ stages.madeDeposit } /></Td>
                            <Td className="text-center"><YesNoIcon status={ stages.startTrading } /></Td>
                          </Tr>
                        </Tbody>
                              
                      </Table>
                    </div>
                  </div>
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
  stages: state.clientReducer.clientDetails && state.clientReducer.clientDetails.stages || {},
});

export default connect(mapStateToProps, null)(withTranslation()(Stages));
