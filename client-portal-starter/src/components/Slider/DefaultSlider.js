import React from "react";
// import OwlCarousel from "react-owl-carousel";
// import { Col } from "reactstrap";
// import "owl.carousel/dist/assets/owl.carousel.css";
// import "owl.carousel/dist/assets/owl.theme.default.css";
import { withTranslation } from "react-i18next";
import def from "assets/img/095aeba3-4cc0-44b7-b786-c03832affe92.png";

const Slider = (props) => {
  return (
    <div className='slider slider_home mb-3'>
      <div className='slider__container rounded'>
        {/* <OwlCarousel style={{ direction: "ltr" }} className="owl-theme" loop items={1}>
          <div className="rounded">
            <div className="w-100">
              <img src={def} alt="" className="img-fluid rounded" />
            </div>
          </div>
        </OwlCarousel> */}
      </div>
    </div>
  );
};

export default withTranslation()(Slider);
