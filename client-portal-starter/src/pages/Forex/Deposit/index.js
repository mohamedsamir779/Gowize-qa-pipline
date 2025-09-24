import CardWrapper from "components/Common/CardWrapper";
import CardHeader from "components/Forex/Common/CardHeader";
import PageHeader from "components/Forex/Common/PageHeader";
import Journey from "components/Journey/Journey";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Container, 
} from "reactstrap";
import WireTransferForm from "./WireTransferForm";
import WireTransfer from "./WireTransfer";
import CryptoForm from "./CryptoForm";

function Deposit() {
  const { t } = useTranslation();
  const [type, setType] = useState();
  return ( <>
    <div className="page-content">
      <Container className="mt-5">
        <PageHeader title="Deposit"></PageHeader>
        <div className="mt-3">
          <Journey></Journey>
        </div>        
        <CardWrapper className="mt-5">
          <CardHeader title={t("Make a Deposit")}></CardHeader>
          <div className="mt-3">
            <div className="text-muted text-center">{t("Choose a payment to add funds into your account.")}</div>
            <div className="d-flex justify-content-center">
              <button className="btn btn-soft-light waves-effect waves-light m-3 rounded bg-white shadow" style={{ width:"150px" }}
                onClick={()=>{
                  setType("CRYPTO");
                }}
              >
                <img src="./img/crypto.png" width={50} height={55}></img>
              </button>
              <button className="btn btn-soft-light waves-effect waves-light m-3 rounded bg-white shadow" style={{ width:"150px" }}
                onClick={()=>{
                  setType("WIRE_TRANSFER");
                }}>
                <img src="./img/wire-transfer.png" width={98} height={61}></img>
              </button>
            </div>
          </div>    
        </CardWrapper>
        {type === "WIRE_TRANSFER" && <>
          <CardWrapper className="mt-3">
            <WireTransferForm></WireTransferForm>
          </CardWrapper>
          <CardWrapper className="mt-3">
            <WireTransfer></WireTransfer>
          </CardWrapper>
        </>}
        {type === "CRYPTO" && <>
          <CardWrapper className="mt-3">
            <CryptoForm></CryptoForm>
          </CardWrapper>
        </>}
      </Container> 
    </div>
  </> );
}

export default Deposit;