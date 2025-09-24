import { AvField } from "availity-reactstrap-validation";
import { Accordion } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import {
  Col, Label, Row
} from "reactstrap";

const AuthorizedPerson = () => {
  const { t } = useTranslation();
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
            />
          </Col>
          <Col md="6" className="mt-4">
            <div className="d-flex gap-2">
              <AvField
                name="corporateInfo.authorizedPerson.usCitizen"
                type="checkbox"
              />
              <Label>{t("US Citizen")}</Label>
            </div>
          </Col>
        </Row>
        <div className="d-flex gap-2">
          <AvField
            name="corporateInfo.authorizedPerson.workedInFinancial"
            type="checkbox"
          />
          <Label>{t("Have worked for at least 2 years in the financial services inndustry")}</Label>
        </div>
        <div className="d-flex gap-2">
          <AvField
            name="corporateInfo.authorizedPerson.politicallyExposed"
            type="checkbox"
          />
          <Label>{t("Them or any of their family are politically exposed")}</Label>
        </div>

      </Accordion.Body>
    </Accordion.Item>
  );
};

export default AuthorizedPerson;