import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { AvField, AvForm } from "availity-reactstrap-validation";
import {
  Button, Card, CardBody, Col, Label, Row
} from "reactstrap";
import { editClientDetails } from "store/client/actions";
import { startCase } from "lodash";

const Personnels = ({ clientId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { corporateInfo } = useSelector((state) => state.clientReducer.clientDetails);
  const [directors, setDirectors] = useState([{ id: 1 }]);
  const [shareholders, setShareholders] = useState([{ id: 1 }]);
  const addDirector = () => {
    const newId = directors.length + 1;
    const newDirector = { id: newId };
    setDirectors([...directors, newDirector]);
  };

  const deleteDirector = (id) => {
    if (directors.length === 1) return;
    const updatedDirectors = directors.filter((director) => director.id !== id);
    setDirectors(updatedDirectors);
  };

  const addShareholder = () => {
    const newId = shareholders.length + 1;
    const newShareholder = { id: newId };
    setShareholders([...shareholders, newShareholder]);
  };

  const deleteShareholder = (id) => {
    if (shareholders.length === 1) return;
    const updatedShareholders = shareholders.filter((shareholder) => shareholder.id !== id);
    setShareholders(updatedShareholders);
  };

  useEffect(() => {
    if (corporateInfo?.directors?.length) {
      const newDirectors = [];
      for (let i = 1; i <= corporateInfo.directors.length; i++) {
        newDirectors.push({ id: i });
      }
      setDirectors(newDirectors);
    }
    if (corporateInfo?.shareholders?.length) {
      const newShareholders = [];
      for (let i = 1; i <= corporateInfo.shareholders.length; i++) {
        newShareholders.push({ id: i });
      }
      setShareholders(newShareholders);
    }
  }, [corporateInfo]);

  const updateClient = (e, values) => {
    dispatch(editClientDetails({
      id: clientId,
      corporatePersonnel: true,
      values,
    }));
  };

  const renderMembers = (members, type) => {
    return (
      <AvForm
        onValidSubmit={(e, v) => { updateClient(e, v) }}
      >
        {members.map((member) => (
          <div key={member.id} className="d-flex flex-column">
            <div className="d-flex justify-content-around align-items-center">
              <AvField
                name={`corporateInfo.${type}[${member.id - 1}].firstName`}
                label={t("First Name")}
                placeholder={t("Enter First Name")}
                type="text"
                errorMessage={t("First Name is required")}
                validate={{ required: { value: true } }}
                value={corporateInfo?.[type]?.[member.id - 1]?.firstName}
              />
              <div className="ms-3">
                <AvField
                  name={`corporateInfo.${type}[${member.id - 1}].lastName`}
                  label={t("Last Name")}
                  placeholder={t("Enter Last Name")}
                  type="text"
                  errorMessage={t("Last Name is required")}
                  validate={{ required: { value: true } }}
                  value={corporateInfo?.[type]?.[member.id - 1]?.lastName}
                />
              </div>
              {type === "shareholders" && (
                <div className="ms-3">
                  <AvField
                    name={`corporateInfo.${type}[${member.id - 1}].sharesPercentage`}
                    label={t("Share %")}
                    placeholder={t("Enter Share %")}
                    type="text"
                    errorMessage={t("Share % is required")}
                    validate={{ required: { value: true } }}
                    value={corporateInfo?.[type]?.[member.id - 1]?.sharesPercentage}
                  />
                </div>
              )}
              <div className="ms-3 mt-4">
                <Label>{t("US Citizen")}</Label>
                <AvField
                  name={`corporateInfo.${type}[${member.id - 1}].usCitizen`}
                  label={t("US Citizen")}
                  type="checkbox"
                  errorMessage={t("US Citizen is required")}
                  value={corporateInfo?.[type]?.[member.id - 1]?.usCitizen}
                />
              </div>
              {members.length > 1 && (
                <div className="ms-3 mt-2">
                  <i
                    onClick={() => {
                      if (type === "directors") {
                        deleteDirector(member.id);
                      } else if (type === "shareholders") {
                        deleteShareholder(member.id);
                      }
                    }}
                    className="mdi mdi-delete font-size-18 text-danger cursor-pointer"
                  ></i>
                </div>
              )}
            </div>
            <div className="d-flex gap-2">
              <AvField
                name={`corporateInfo.${type}[${member.id - 1}].workedInFinancial`}
                type="checkbox"
                value={corporateInfo?.[type]?.[member.id - 1]?.workedInFinancial}
              />
              <Label>{t("Have worked for at least 2 years in the financial services inndustry")}</Label>
            </div>
            <div className="d-flex gap-2">
              <AvField
                name={`corporateInfo.${type}[${member.id - 1}].politicallyExposed`}
                type="checkbox"
                value={corporateInfo?.[type]?.[member.id - 1]?.politicallyExposed}
              />
              <Label>{t("Them or any of their family are politically exposed")}</Label>
            </div>

          </div>
        ))}
        <div className="text-end">
          <Button size="sm" color="light" onClick={type === "directors" ? addDirector : addShareholder}>{`Add ${startCase(type)}`}</Button>
        </div>

        <div className="text-end mt-3">
          <Button type="submit" color="primary">{`Update ${startCase(type)}`}</ Button>
        </div>

      </AvForm>
    );
  };

  return (
    <Row>
      <Col>
        <Card style={{
          overflow: "visible",
        }} className="pb-2">
          <CardBody style={{ position: "relative" }}>
            <h5>{t("Directors")}</h5>
            {renderMembers(directors, "directors")}
          </CardBody>
        </Card>
      </Col>
      <Col>
        <Card style={{
          overflow: "visible",
        }} className="pb-2">
          <CardBody style={{ position: "relative" }}>
            <h5>{t("Shareholders")}</h5>
            {renderMembers(shareholders, "shareholders")}
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default Personnels;
