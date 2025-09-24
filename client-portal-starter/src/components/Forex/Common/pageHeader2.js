import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MetaTags } from "react-meta-tags";
import { Button } from "reactstrap";

function PageHeader2(props) {
  const { t } = useTranslation();
  const history = useHistory();
  const { title } = props;
  return (
    <>      
      <MetaTags>
        {t(title)}
      </MetaTags>
      <div className="d-flex justify-content-between"
        
      >
        <h1 className="color-primary" style={{
          zIndex: 5,
        }}>{t(title)}</h1>
        <div className="d-flex justify-content-end">
          <Button className="mx-3 color-bg-btn border-0" 
            style={{
              zIndex: 5,
            }}
            onClick={() => history.push("/platforms")}
          >
            {t("Download Platform")}
          </Button>
        </div>
      </div>
    </>);
}

export default PageHeader2;