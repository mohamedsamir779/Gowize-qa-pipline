import { useSelector } from "react-redux";
import {
  Card, CardBody, CardHeader, CardTitle
} from "reactstrap";
import GeneratePDF from "./generatePDF";
import PreviewPDF from "./PreviewPDF";
const { useTranslation } = require("react-i18next");

export const Applications = () => {
  const { t } = useTranslation();
  const { fx, isCorporate = false } = useSelector((state) => state?.clientReducer?.clientDetails ?? {
    fx: {
      isIb: false,
      isClient: false
    },
    isCorporate: false
  });
  const { isIb, isClient } = fx ?? {
    isIb: false,
    isClient: false
  };
  const aplicationTitles = [];
  if (isCorporate && isClient)
    aplicationTitles.push({
      title: "Corporate Application",
      isIb: false
    });
  else if (!isCorporate && isClient)
    aplicationTitles.push({
      title: "Individual Application",
      isIb: false
    });
  if (isCorporate && isIb)
    aplicationTitles.push({
      title: "Corporate IB Application",
      isIb: true
    });
  else if (!isCorporate && isIb)
    aplicationTitles.push({
      title: "Broker Application",
      isIb: true
    });

  if (!isIb && !isClient) return null;
  return (
    <Card>
      <CardHeader className="d-flex flex-column gap-3">
        <div className="d-flex justify-content-between align-items-center">
          <CardTitle className="color-primary">{t("Applications")}</CardTitle>
        </div>
      </CardHeader>
      <CardBody>
        {
          aplicationTitles.map((app, index) =>
            <div key={index} className="mt-3 pb-3 d-flex border-bottom justify-content-between align-items-center">
              <span className="me-auto">{app.title}</span>
              <PreviewPDF heading={app.title} isIb={app.isIb} />
              <GeneratePDF heading={app.title} isIb={app.isIb} />
            </div>
          )
        }
      </CardBody>
    </Card>

  );
};
