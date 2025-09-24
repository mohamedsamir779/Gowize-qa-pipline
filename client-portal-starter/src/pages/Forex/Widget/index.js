import React, { useEffect } from "react";
import { Helmet } from "react-helmet";


const Widget = () => {
  const getWindowDimensions = () => {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height,
    };
  };
  const [height, setHeight] = React.useState(300);
  useEffect(() => {
    const { height } = getWindowDimensions();
    setHeight(height - height * 0.1);
  }, []);

  return (
    <>
      <div id="finlogix-container" className={"finlogix-container"} style={{
        height,
        zIndex: 3,
        position: "relative",
        fontSize: "4rem"
      }}></div>
      <Helmet>
        <script src='https://widget.finlogix.com/Widget.js' ></script>

        <script type="text/javascript">
          {`
            setTimeout(() => {
              Widget.init({
            type: "EconomicCalendar",
            language: "en",
            importanceOptions: [
            "low",
            "medium",
            "high"
            ],
            dateRangeOptions: [
            "recentAndNext",
            "thisWeek",
            "today",
            "tomorrow",
            "nextWeek",
            "thisMonth"
            ],
            isAdaptive: true
            });          }, 1000);
          `}
        </script>
      </Helmet>
    </>
  );
};

export default Widget;
