import CardWrapper from "components/Common/CardWrapper";
import PageHeader from "components/Forex/Common/PageHeader";
import { useEffect, useState } from "react";
import { Container } from "reactstrap";
import Disclamer from "./Disclamer";
// import Trader from "./Trader";
import { default as WTrader } from "./WebTrader";

function WebTrader() {
  const [accept, setAccept] = useState(localStorage.getItem("acceptTraderDisclamer"));
  const checkDisclamerAccepted = localStorage.getItem("acceptTraderDisclamer");
  useEffect(() => {
    document.title = "Web Trader";
  }, []);
  return ( <>
    <div className="forex page-content mt-5">
      <Container>
        <PageHeader title="Web Trader"/>
        {!accept && !checkDisclamerAccepted && <CardWrapper className="d-flex mt-4">
          <Disclamer setAccept={setAccept}/>
        </CardWrapper>}
        {checkDisclamerAccepted  && <WTrader/>}
        
      </Container>
    </div>
  </> );
}

export default WebTrader;