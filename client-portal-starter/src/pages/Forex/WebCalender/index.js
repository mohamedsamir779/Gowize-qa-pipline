
import React, { useEffect } from "react";
import "./webtrader.scss";
const WebCalendar = (props) => {
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    console.log("11111111111111");
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const getWindowDimensions = () => {

    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height
    };
  };
  const [height, setHeight] = React.useState(600);
  useEffect(() => {
    const { height } = getWindowDimensions();
    setHeight(height - (height * 0.1));
  }, []);

  return (
    <>
      <div className="container-iframe mt-4">
        <iframe className="responsive-iframe mt-5" src="https://app.salesforceiq.com/r?target=66fe5c81e2ecdc687d01f95b&t=AFwhZf05Pvz-5Hjl94T4_MynTKTh_LweV8NmCn4VmpnGlANBQ0NDd-nw2MIhM3A1b3DF7NC0VP7f5-G59mtkg7fdCB_hbiLYNLBfzjj-wSQ9HsIzfz6ARoe7f1guOFmdeyzj8tc540ib&url=https%3A%2F%2Feia.autochartist.com%2Fcalendar%2F%3Fbroker_id%3D945%26showall%3Dtrue%26nextdays%3D3%26token%3D9b37d229cd8a37d91cb2b77d2a872f60%26expire%3D1777500000%26user%3DGo-Wize%26locale%3Den%23%2Fcalendar"></iframe>
      </div>

    </>
  );
};


export default WebCalendar;