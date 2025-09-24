import { useTranslation } from "react-i18next";
import {
  Card, CardBody, CardHeader, CardTitle
} from "reactstrap";

const OtherInfo = ({ info }) => {
  const { t } = useTranslation();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="color-primary">
          {t("Other Information")}
        </CardTitle>
      </CardHeader>
      <CardBody className="d-flex flex-column gap-3">
        <div>
          <h6>{t("Annual Tunrover")}</h6>
          <span>{"$ " + info?.turnOver}</span>
        </div>
        <div>
          <h6>{t("Balancesheet Balance")}</h6>
          <span>{"$ " + info?.balanceSheet}</span>
        </div>
        <div>
          <h6>{t("Purpose of Investment")}</h6>
          {info.purpose?.length > 0 &&
            info.purpose?.map((purpose, index) => {
              return <div className="d-flex gap-3 align-items-start align-items-center" key={index}>
                <input type="checkbox" className="" checked={true} />
                <span style={{ fontSize: "12px" }}>{purpose}</span>
              </div>;
            })}
        </div>
      </CardBody>
    </Card>

  );
};

export default OtherInfo;