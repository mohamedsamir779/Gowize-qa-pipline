import React from "react";
import OwlCarousel from "react-owl-carousel";
// import { Col } from "reactstrap";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import { withTranslation } from "react-i18next";

const Slider = (props) => {
  const options = {
    items: 1,
    loop: true,
    autoplay: true,
    autoplayTimeout: 3000,
  };
  return (
    <div className='slider slider_home mb-3'>
      <div className='slider__container'>
        <OwlCarousel style={{ direction: "ltr" }} className="owl-theme" {...options}>
          <div className="slider__item justify-content-center align-items-center p-relative">
            <div className="slider__preview"><img src="img/figures-1.png" alt="" /></div>
            <div className="slider-wrap">
              <p className="slider-title">{props.t("Tokens for the")}</p>
              <p className="slider-title">{props.t("Modern Money")}</p>
              <div className="slider-title">
                {props.t("The first cryptocurrency")}
              </div>
              <div className="slider-title">
                {props.t("that can be spent anywhere")}
              </div>
            </div>
          </div> 
          <div className="slider__item justify-content-center align-items-center p-relative">
            <div className="slider__preview"><img src="img/figures-1.png" alt="" /></div>
            <div className="slider-wrap">
              <p className="slider-title">{props.t("Tokens for the")}</p>
              <p className="slider-title">{props.t("Modern Money")}</p>
              <div className="slider-title">
                {props.t("The first cryptocurrency")}
              </div>
              <div className="slider-title">
                {props.t("that can be spent anywhere")}
              </div>
            </div>
          </div> 
          <div className="slider__item justify-content-center align-items-center p-relative">
            <div className="slider__preview"><img src="img/figures-1.png" alt="" /></div>
            <div className="slider-wrap">
              <p className="slider-title">{props.t("Tokens for the")}</p>
              <p className="slider-title">{props.t("Modern Money")}</p>
              <div className="slider-title">
                {props.t("The first cryptocurrency")}
              </div>
              <div className="slider-title">
                {props.t("that can be spent anywhere")}
              </div>
            </div>
          </div> 
        </OwlCarousel>
      </div>
    </div>
  );
};
export default withTranslation()(Slider); 