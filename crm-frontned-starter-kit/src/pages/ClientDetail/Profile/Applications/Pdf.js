import { createRef, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Col, Container, Input, Row
} from "reactstrap";
import { mainLogo } from "content";
import { LANGUAGES as languageList } from "common/languages";

const Pdf = (props) => {
  const { heading, isIb, onPdfRef, toGenerate } = props;
  const {
    title,
    email,
    firstName,
    lastName,
    phone,
    address,
    city,
    country,
    zipCode,
    language,
    dob,
    nationality,
    experience,
    gender,
    usCitizen,
    financialInfo,
    taxIdentificationNumber,
    declarations,
    idDetails,
    fx: { ibQuestionnaire },
    isCorporate,
    corporateInfo,
  } = useSelector((state) => state.clientReducer.clientDetails);

  const lang = languageList.find((v) => v.value === language);
  const pdfRef = createRef();

  useEffect(() => {
    onPdfRef && onPdfRef(pdfRef.current);
  }, []);

  return (
    <div ref={pdfRef} id={toGenerate ? "ref" : ""} >
      <div className="p-4">
        <Row className="align-items-center">
          <Col>
            <img height="80px" src={mainLogo} />
          </Col>
          <Col className="text-center">
            <h4>{`Online ${heading}`}</h4>
          </Col>
          <Col></Col>
        </Row>


        <h5 className="topBar color-primary">General Information</h5>
        <Container fluid>
          <Row className="mt-2">
            {!isCorporate &&
              <>
                <Col className="key">Title:</Col>
                <Col>
                  <div className="border-bottom">{title}</div>
                </Col>
              </>
            }
            <Col className="key">{`${isCorporate ? "Company" : "First"} Name`}</Col>
            <Col>
              <div className="border-bottom">{firstName}</div>
            </Col>
            {!isCorporate &&
              <>
                <Col className="key">Last Name:</Col>
                <Col>
                  <div className="border-bottom">{lastName}</div>
                </Col>
              </>
            }
          </Row>
          <Row className="mt-2">
            <Col className="key">Cell Phone:</Col>
            <Col>
              <div className="border-bottom">{phone}</div>
            </Col>
            <Col className="key">Email:</Col>
            <Col>
              <div className="border-bottom">{email}</div>
            </Col>
            {!isCorporate &&
              <>
                <Col className="key">Address:</Col>
                <Col>
                  <div className="border-bottom">{address}</div>
                </Col>
              </>
            }
          </Row>
          <Row className="mt-2">
            <Col className="key">{`Date of ${isCorporate ? "Incorporation" : "Birth"}`}</Col>
            <Col>
              <div className="border-bottom">{dob}</div>
            </Col>
            {!isCorporate &&
              <>

                <Col className="key">Nationality:</Col>
                <Col>
                  <div className="border-bottom">{nationality}</div>
                </Col>
              </>
            }
            <Col className="key">Language: </Col>
            <Col>
              <div className="border-bottom">{lang && lang.name}</div>
            </Col>
          </Row>
          {!isCorporate &&
            <Row className="mt-2">
              <Col className="key">Gender:</Col>
              <Col>
                <div className="border-bottom">{gender}</div>
              </Col>
              <Col className="key">Worked in financial?</Col>
              <Col>
                <div className="border-bottom">{financialInfo?.workedInFinancial}</div>
              </Col>
              <Col className="key"></Col>
              <Col></Col>
            </Row>
          }
          {isCorporate &&
            <>
              <Row className="mt-2">
                <Col className="key">Registered Address:</Col>
                <Col>
                  <div className="border-bottom">{`${address}, ${city}, ${country}, ${zipCode}`}</div>
                </Col>
              </Row>
              <Row className="mt-2">
                <Col className="key">HQ Address:</Col>
                <Col>
                  <div className="border-bottom">{`${corporateInfo?.hqAddress?.address}, ${corporateInfo?.hqAddress?.city}, ${corporateInfo?.hqAddress?.country}, ${corporateInfo?.hqAddress?.zipCode}`}</div>
                </Col>
              </Row>
              <Row className="mt-2">
                <Col className="key">Bussiness Nature:</Col>
                <Col>
                  <div className="border-bottom">{corporateInfo?.nature}</div>
                </Col>
                <Col className="key">Turnover:</Col>
                <Col>
                  <div className="border-bottom">{corporateInfo?.turnOver}</div>
                </Col>
                <Col className="key">Balancesheet:</Col>
                <Col>
                  <div className="border-bottom">{corporateInfo?.balanceSheet}</div>
                </Col>
              </Row>
              <Row className="mt-3">
                <h5 className="">Authorized Person</h5>
              </Row>
              <Row className="mt-2">
                <Col className="key">First Name:</Col>
                <Col>
                  <div className="border-bottom">{corporateInfo.authorizedPerson?.firstName}</div>
                </Col>
                <Col className="key">Last Name:</Col>
                <Col>
                  <div className="border-bottom">{corporateInfo.authorizedPerson?.lastName}</div>
                </Col>
                <Col className="key">Job Title:</Col>
                <Col>
                  <div className="border-bottom">{corporateInfo.authorizedPerson?.jobTitle}</div>
                </Col>
              </Row>
              <Row className="mt-3">
                <h5 className="">Shareholders</h5>
              </Row>
              { corporateInfo.shareholders?.length > 0 &&
                corporateInfo.shareholders.map((shareholder) => (
                  <Row className="mt-2" key={shareholder._id}>
                    <Col className="key">First Name:</Col>
                    <Col>
                      <div className="border-bottom">{shareholder.firstName}</div>
                    </Col>
                    <Col className="key">Last Name:</Col>
                    <Col>
                      <div className="border-bottom">{shareholder.lastName}</div>
                    </Col>
                    <Col className="key">Shares %:</Col>
                    <Col>
                      <div className="border-bottom">{shareholder.sharesPercentage}</div>
                    </Col>
                  </Row>
                ))
              }
              <Row className="mt-3">
                <h5 className="">Directors</h5>
              </Row>
              { corporateInfo.directors?.length > 0 &&
                corporateInfo.directors.map((director) => (
                  <Row className="mt-2" key={director._id}>
                    <Col className="key">First Name:</Col>
                    <Col>
                      <div className="border-bottom">{director.firstName}</div>
                    </Col>
                    <Col className="key">Last Name:</Col>
                    <Col>
                      <div className="border-bottom">{director.lastName}</div>
                    </Col>
                  </Row>
                ))
              }
            </>
          }
          {idDetails && idDetails.type !== "" && (
            <>
              <Row className="mt-2">
                <Col className="key">ID Type:</Col>
                <Col>
                  <div className="border-bottom">{idDetails.type || "N/A"}</div>
                </Col>
                <Col className="key">Number:</Col>
                <Col>
                  <div className="border-bottom">{idDetails.documentNo || "N/A"}</div>
                </Col>
                <Col className="key">Country of Issue:</Col>
                <Col>
                  <div className="border-bottom">
                    {idDetails.countryOfIssue || "N/A"}
                  </div>
                </Col>
              </Row>
            </>
          )}
        </Container>

        {!isCorporate &&
          <>
            <h5 className="topBar">Financial Information</h5>
            <Container fluid>
              <Row>
                <Col className="key">Annual Income:</Col>
                <Col>
                  <div className="border-bottom">{financialInfo?.annualIncome}</div>
                </Col>
                <Col className="key">Source of Funds:</Col>
                <Col>
                  <div className="border-bottom">{financialInfo?.sourceOfFunds}</div>
                </Col>
              </Row>
            </Container>


            {experience && (
              <>
                <h5 className="topBar">Employment Details</h5>
                <Container fluid>

                  <Row>
                    <Col className="key">Employment Status:</Col>
                    <Col>
                      <div className="border-bottom">
                        {experience.employmentStatus}
                      </div>
                    </Col>
                    <Col className="key">Industry:</Col>
                    <Col>
                      <div className="border-bottom">{experience.profession}</div>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="key">Job Title:</Col>
                    <Col>
                      <div className="border-bottom">{experience.jobTitle || "N/A"}</div>
                    </Col>
                    <Col className="key">Name of Employer:</Col>
                    <Col>
                      <div className="border-bottom">
                        {experience.employer || "N/A"}
                      </div>
                    </Col>
                  </Row>
                </Container>
              </>
            )}


            <h5 className="topBar">FATCA</h5>
            <Container fluid>
              <Row>
                <Col>
                  <span className="inqueries">Are you a citizen of the United States of America?</span>&nbsp;
                  <span
                    className={`border-bottom ${ibQuestionnaire?.usCitizen === "yes" ? " text-success" : " text-danger"}`}>
                    {usCitizen?.toUpperCase()}
                  </span>
                </Col>
                <Col>
                  <span className="inqueries">Tax Identification:</span>&nbsp;
                  <span className="border-bottom">
                    {taxIdentificationNumber
                      ? taxIdentificationNumber
                      : "N/A"}
                  </span>
                </Col>
              </Row>
            </Container>
          </>
        }


        {isIb && ibQuestionnaire && (
          <>
            <h5 className="topBar">IB Questionnaire</h5>
            <Container fluid>
              <Row>
                <Col>
                  <span className="inqueries">Have Website/Blog for promotion?</span>&nbsp;
                  <span
                    className={`border-bottom ${ibQuestionnaire.haveSite === "yes" ? " text-success" : " text-danger"}`}>
                    {ibQuestionnaire?.haveSite?.toUpperCase()}
                  </span>
                </Col>
                <Col>
                  <span className="inqueries">Have you reffered clients to other providers?</span>&nbsp;
                  <span
                    className={`border-bottom ${ibQuestionnaire.refOther === "yes" ? " text-success" : " text-danger"}`}>
                    {ibQuestionnaire.refOther.toUpperCase()}
                  </span>
                </Col>
              </Row>
              <Row>
                <Col>
                  <span className="inqueries">How do you acquire clients?</span>&nbsp;
                  <span className="border-bottom">
                    {ibQuestionnaire.getClients}
                  </span>
                </Col>
                <Col>
                  <span className="inqueries">Countries of audience intending to acquire:</span>&nbsp;
                  <span className="border-bottom">
                    {ibQuestionnaire.targetCountries.join(", ")}
                  </span>
                </Col>
              </Row>
              <Col>
                <span className="inqueries">Expected Clients in 12 Months:</span>&nbsp;
                <span className="border-bottom">
                  {ibQuestionnaire.expectedClients}
                </span>
              </Col>
            </Container>
          </>
        )}


        {(declarations && declarations.length > 0) && (
          <>
            <h5 className="topBar">Declarations</h5>
            <Container fluid>
              {declarations.map((v, index) => (
                <div key={index} className="d-flex align-items-start">
                  <Input className="me-2 mt-2" type="checkbox" defaultChecked />
                  <span dangerouslySetInnerHTML={{ __html: v }} />
                </div>
              ))}
            </Container>
          </>
        )}


        <Row className="text-center mt-5 justify-content-around align-items-center">
          <Col xs="2">
            <p>&nbsp;</p>
            <p className="border-top">Company Signature</p>
          </Col>
          <Col xs="2">
            <p className="signature">{`${firstName} ${lastName}`}</p>
            <p className="border-top">
              Client Signature
            </p>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Pdf;
