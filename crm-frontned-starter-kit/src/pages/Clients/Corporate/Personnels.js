import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AvField } from "availity-reactstrap-validation";
import { Accordion } from "react-bootstrap";
import { Button, Label } from "reactstrap";
import { startCase } from "lodash";

const Personnels = () => {
  const { t } = useTranslation();
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

  const renderMembers = (members, type) => {
    return (
      <>
        {members.map((member) => (
          <div key={member.id} className="d-flex flex-column">
            <div className="d-flex justify-content-between align-items-center">
              <AvField
                name={`corporateInfo.${type}[${member.id - 1}].firstName`}
                label={t("First Name")}
                placeholder={t("Enter First Name")}
                type="text"
                errorMessage={t("First Name is required")}
                validate={{ required: { value: true } }}
              />
              <div className="ms-3">
                <AvField
                  name={`corporateInfo.${type}[${member.id - 1}].lastName`}
                  label={t("Last Name")}
                  placeholder={t("Enter Last Name")}
                  type="text"
                  errorMessage={t("Last Name is required")}
                  validate={{ required: { value: true } }}
                />
              </div>
              {type === "shareholders" && (
                <div className="ms-3">
                  <AvField
                    name={`corporateInfo.${type}[${member.id - 1}].sharesPercentage`}
                    label={t("Share %")}
                    placeholder={t("Enter Share %")}
                    type="number"
                    max="100"
                    errorMessage={t("Share % is required")}
                    validate={{ required: { value: true } }}
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
              />
              <Label>{t("Have worked for at least 2 years in the financial services inndustry")}</Label>
            </div>
            <div className="d-flex gap-2">
              <AvField
                name={`corporateInfo.${type}[${member.id - 1}].politicallyExposed`}
                type="checkbox"
              />
              <Label>{t("Them or any of their family are politically exposed")}</Label>
            </div>

          </div>
        ))}
        <div className="text-end">
          <Button size="sm" color="light" onClick={type === "directors" ? addDirector : addShareholder}>{`Add ${startCase(type)}`}</Button>
        </div>
      </>
    );
  };

  return (
    <Accordion.Item eventKey="1">
      <Accordion.Header>{t("Personnels")}</Accordion.Header>
      <Accordion.Body>
        <div>
          <h5>{t("Directors")}</h5>
          {renderMembers(directors, "directors")}
          <h5>{t("Shareholders")}</h5>
          {renderMembers(shareholders, "shareholders")}
        </div>
      </Accordion.Body>
    </Accordion.Item>
  );
};

export default Personnels;