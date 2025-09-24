import { AvField } from "availity-reactstrap-validation";
import { Accordion } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Col, Row } from "reactstrap";

const AuthorizedPerson = () => {
  const { t } = useTranslation();
  const { authorizedPerson } = useSelector((state) => state.Profile.clientData.corporateInfo);
  return (
    <Accordion.Item eventKey="2">
      <Accordion.Header>{t("Authorized Person")}</Accordion.Header>
      <Accordion.Body>
        <Row className="mb-2">
          <Col md="6">
            <AvField
              name="corporateInfo.authorizedPerson.firstName"
              label={t("First Name")}
              placeholder={t("Enter First Name")}
              type="text"
              errorMessage={t("First Name is required")}
              validate={{ required: { value: true } }}
              value={authorizedPerson?.firstName}
            />
          </Col>
          <Col md="6">
            <AvField
              name="corporateInfo.authorizedPerson.lastName"
              label={t("Last Name")}
              placeholder={t("Enter Last Name")}
              type="text"
              errorMessage={t("Last Name is required")}
              validate={{ required: { value: true } }}
              value={authorizedPerson?.lastName}
            />
          </Col>
        </Row>
        <Row className="mb-2">
          <Col md="6">
            <AvField
              name="corporateInfo.authorizedPerson.phone"
              label={t("Phone")}
              placeholder={t("Enter Phone")}
              type="text"
              errorMessage={t("Phone is required")}
              validate={{ required: { value: true } }}
              value={authorizedPerson?.phone}
            />
          </Col>
          <Col md="6">
            <AvField
              name="corporateInfo.authorizedPerson.landline"
              label={t("Landline")}
              placeholder={t("Enter Landline")}
              type="text"
              errorMessage={t("Landline is required")}
              validate={{ required: { value: true } }}
              value={authorizedPerson?.landline}
            />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col md="6">
            <AvField
              name="corporateInfo.authorizedPerson.jobTitle"
              label={t("Job Title")}
              placeholder={t("Enter Job Title")}
              type="text"
              errorMessage={t("Job Title is required")}
              validate={{ required: { value: true } }}
              value={authorizedPerson?.jobTitle}
            />
          </Col>
          <Col md="6" className="mt-4">
            <AvField
              name="corporateInfo.authorizedPerson.usCitizen"
              label={t("US Citizen")}
              type="checkbox"
              value={authorizedPerson?.usCitizen}
            />
          </Col>
        </Row>
      </Accordion.Body>
    </Accordion.Item>
  );
};

export default AuthorizedPerson;