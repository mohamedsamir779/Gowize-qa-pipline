import React from "react";
import {
  Row, Col, Card, CardBody, 
  CardTitle, CardHeader
} from "reactstrap";
import {
  Table, Thead, Tbody, Tr, Th, Td
} from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";

function YesNoIcon ({ status }) {
  return (status
    ? <i className="bx bx-check-circle" style={{ fontSize: "1.5rem" }} />
    : <i className="bx bx-x-circle" style={{ fontSize: "1.5rem" }} />
  );
}

function IbStages(props) {
  const { stages } = props;
  return ( <>
    <div className="">
      <div className="container-fluid">
        <Row>
          <Col className="col-12">
            <Card>
              <CardHeader className="d-flex justify-content-between  align-items-center">
                <CardTitle className="color-primary">
                  {props.t("Ib Stage")}
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
                      <Thead className="text-center table-light" >
                        <Tr className="color-primary">
                          <Th >{"Personal Info"}</Th>
                          <Th >{"Questionnaire"}</Th>
                          <Th >{"KYC Upload"}</Th>
                          <Th >{"KYC Rejected"}</Th>
                          <Th >{"KYC Approval"}</Th>
                          <Th >{"Agreement Granted"}</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        <Tr>
                          <Td className="text-center"><YesNoIcon status={ stages?.individual && stages?.individual?.submitProfile  || false} /></Td>
                          <Td className="text-center"><YesNoIcon status={ stages.ib && stages.ib.ibQuestionnaire } /></Td>
                          <Td className="text-center"><YesNoIcon status={ stages.kycUpload } /></Td>
                          <Td className="text-center"><YesNoIcon status={ stages.kycRejected } /></Td>
                          <Td className="text-center"><YesNoIcon status={ stages.kycApproved } /></Td>
                          <Td className="text-center"><YesNoIcon status={ stages.ib && stages.ib.partnershipAgreement } /></Td>
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
  </> );
}

const mapStateToProps = (state) => ({
  stages: state.clientReducer.clientDetails && state.clientReducer.clientDetails.stages || {},
});
  
export default connect(mapStateToProps, null)(withTranslation()(IbStages));
