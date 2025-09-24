import { Col } from "reactstrap";
import { withTranslation } from "react-i18next";
import CardWrapper from "components/Common/CardWrapper";

const Platform = ({ t, image, logo, title, subTitle, isLocalImg, onDownload, style, isMobile }) => {
  return (
    <Col xs="12" md="6" lg="3" onClick={onDownload} style={style}>
      <CardWrapper
        className="pt-0 px-0 shadow"
        style={{
          cursor: "pointer",
          overflow: "hidden",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}
      >
        <div className="text-center">
          <img
            src={isLocalImg ? `/img/platforms/${image}.png` : image}
            alt={title}
            style={{ 
              width: `${isMobile ? "50%" : "100%"}`, 
              height: "100%", 
              objectFit: "cover",
            }}
          />
        </div>
        <div className="text-center">
          <div className="r text-center ms-3">
            <h6 className="lh-sm">{t(title)}</h6>
            <small className="text-muted">{t(subTitle)}</small>
          </div>
        </div>
      </CardWrapper>
    </Col>
  );
};

export default withTranslation()(Platform);