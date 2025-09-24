import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { AvField } from "availity-reactstrap-validation";
import { Accordion } from "react-bootstrap";
import { Button } from "reactstrap";

const Personnels = () => {
  const { t } = useTranslation();
  const { corporateInfo } = useSelector((state) => state.Profile.clientData);
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

  const renderMembers = (members, type) => {
    return members.map((member) => (
      <div key={member.id} className="d-flex justify-content-start align-items-end mt-2">
        <div className="ms-lg-5">
          <AvField
            name={`corporateInfo.${type}[${member.id - 1}].firstName`}
            label={t("First Name")}
            placeholder={t("Enter First Name")}
            type="text"
            errorMessage={t("First Name is required")}
            validate={{ required: { value: true } }}
            value={corporateInfo?.[type]?.[member.id - 1]?.firstName}
          />
        </div>
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
        <div className="ms-3">
          <AvField
            name={`corporateInfo.${type}[${member.id - 1}].usCitizen`}
            label={t("US Citizen")}
            type="checkbox"
            errorMessage={t("US Citizen is required")}
            value={corporateInfo?.[type]?.[member.id - 1]?.usCitizen}
          />
        </div>
        {members.length > 1 && (
          <div className="ms-3">
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
    ));
  };

  return (
    <Accordion.Item eventKey="1">
      <Accordion.Header>{t("Personnels")}</Accordion.Header>
      <Accordion.Body>
        <div>
          <h5>{t("Directors")}</h5>
          {renderMembers(directors, "directors")}
          <div className="text-end">
            <Button size="sm" color="light" onClick={addDirector}>Add Director</Button>
          </div>
          <h5>{t("Shareholders")}</h5>
          {renderMembers(shareholders, "shareholders")}
          <div className="text-end">
            <Button size="sm" color="light" onClick={addShareholder}>Add Shareholder</Button>
          </div>
        </div>
      </Accordion.Body>
    </Accordion.Item>
  );
};

export default Personnels;