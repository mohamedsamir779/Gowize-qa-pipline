import PropTypes from "prop-types";
import MetaTags from "react-meta-tags";
import React, { useState } from "react";
import {
  Carousel, CarouselItem, CarouselIndicators, Row, Container
} from "reactstrap";

import img1 from "../../assets/images/users/avatar-1.jpg";
import * as content from "content";

import { withRouter } from "react-router-dom";
import { withTranslation } from "react-i18next";

// availity-reactstrap-validation


// actions

// import images

//Import config


const items = [
  {
    id: 1,
    img: img1,
    name: content.clientName + " CRM",
    designation: "Support",
    description:
        "Uh-oh. Whatever you're looking for doesn't seem to exist. Which begs the question: How certain are you that what you're looking for is actually what you need?",
  },
];

const Login = (props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
  };

  const slides = items.map(item => {
    return (
      <CarouselItem
        tag="div"
        key={item.id}
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
      >
        <div className="carousel-item active">
          <div className="testi-contain text-white">
            <i className="bx bxs-quote-alt-left text-success display-6"></i>

            <h4 className="mt-4 fw-medium lh-base text-white">
              “{item.description}”
            </h4>
            <div className="mt-4 pt-3 pb-5">
              <div className="d-flex align-items-start">
                <div className="flex-shrink-0">
                  <img
                    src={item.img}
                    className="avatar-md img-fluid rounded-circle"
                    alt="..."
                  />
                </div>
                <div className="flex-grow-1 ms-3 mb-4">
                  <h5 className="font-size-18 text-white">{item.name}</h5>
                  <p className="mb-0 text-white-50">{item.designation}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CarouselItem>
    );
  });
  // const { error } = useSelector(state => ({
  //   error: state.Login.error,
  // }));
  // console.log(error);
  // handleValidSubmit

  
  return (
    <React.Fragment>
      <MetaTags>
        <title>{props.t("Login")}</title>
      </MetaTags>
      <div className="auth-page">
        <Container fluid className="p-0">
          <Row className="g-0">
            
            <div className="col-xxl-12 col-lg-12 col-md-12">
              <div className="auth-bg pt-md-5 p-4 d-flex">
                <div className="bg-overlay bg-primary"></div>
                <ul className="bg-bubbles">
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                </ul>
                <div className="row justify-content-center align-items-center">
                  <div className="col-xl-7">
                    <div className="p-0 p-sm-4 px-xl-0">
                      <div
                        id="reviewcarouselIndicators"
                        className="carousel slide"
                        data-bs-ride="carousel"
                      >
                        <CarouselIndicators
                          items={items}
                          activeIndex={activeIndex}
                          onClickHandler={goToIndex}
                        />
                        <Carousel
                          activeIndex={activeIndex}
                          next={next}
                          previous={previous}
                        >
                          {slides}
                        </Carousel>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withRouter(withTranslation()(Login));

Login.propTypes = {
  history: PropTypes.object,
};
