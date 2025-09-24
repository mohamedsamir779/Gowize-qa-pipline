import React from "react";
import OwlCarousel from "react-owl-carousel";
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
          <div className=" justify-content-center align-items-center p-relative">
            <div className=""  style={{
              position: "static", 
              width: "100%"
            }}>
              <img src="img/banner.png" alt="" />
            </div>
          </div> 
          {/* <div className=" justify-content-center align-items-center p-relative">
            <div className="" style={{
              position: "static", 
              width: "100%"
            }}>
              <img src="img/slider2.png" alt="" />
            </div>            
          </div> 
          <div className=" justify-content-center align-items-center p-relative">
            <div className="" style={{
              position: "static", 
              width: "100%"
            }}>
              <img src="img/slider3.png" alt="" />
            </div>            
          </div>  */}
        </OwlCarousel>
      </div>
    </div>
  );
};
export default withTranslation()(Slider); 