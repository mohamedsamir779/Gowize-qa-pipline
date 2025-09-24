import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Col,
  Form,
  Label,
  Row
} from "reactstrap";
import { fetchWallets, toggleCurrentModal } from "../../../store/actions";
import CustomModal from "../../Common/CustomModal";
import QRCode from "qrcode.react";
import WalletsListSelect from "components/Common/WalletsListSelect";
import NetworksListSelect from "components/Common/NetworksListSelect";

import { withTranslation } from "react-i18next";

function CryptoDeposit({ isOpen, toggleOpen, ...props }) {
  const wallets = useSelector((state) => state.crypto.wallets?.wallets);

  const [activeStep, setActiveStep] = useState(0);
  const [networkAddress, setNetworkAddress] = useState(null);
  const [networkName, setNetworkName] = useState(null);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const dispatch = useDispatch();
  function toggleTab(tab) {
    if (activeStep !== tab) {
      setActiveStep(tab);
    }
  }
  const loadWallets = () => {
    dispatch(fetchWallets({
      limit: 100,
      page: 1
    }));
  };

  useEffect(() => {
    loadWallets();
  }, []);

  const steps = [
    {
      header: "Select Method",
      content: (
        <>
          <div className="my-2">
            <Form>
              <Row className="mb-3">
                <Col>
                  <Label className="mb-2">{props.t("Coin")}</Label>
                  <WalletsListSelect
                    className="h-50"
                    onChange={(e) => {
                      setSelectedWallet(e.value);
                      setNetworkAddress(null);
                    }}
                    wllates={wallets.filter(x => x.isCrypto)}
                  >
                  </WalletsListSelect>
                </Col>
                <Col>
                  <Label className="mb-2">{props.t("Network")}</Label>
                  <NetworksListSelect
                    className="h-50"
                    noOptionsMessage={({ inputValue }) => !inputValue && "Select a coin first"}
                    onChange={(e) => {
                      setNetworkAddress(e.value.address);
                      setNetworkName(e.value.chainId.name);
                    }}
                    networks={selectedWallet ? selectedWallet?.networks : []}
                  >
                  </NetworksListSelect>
                </Col>
              </Row>
              <h6>{props.t("Address")}</h6>
              <div className="text-center">
                <p
                  className="fw-bold text-muted my-2"
                  style={{ wordWrap: "break-word" }}
                >
                  {networkAddress ? networkAddress : props.t("Select wallet")}
                  <i
                    className="mdi mdi-file-document-multiple-outline ms-2"
                    onClick={() => {
                      navigator.clipboard.writeText(networkAddress);
                    }}
                  ></i>
                </p>
                <p className="mt-2 mb-3">
                  {props.t("Scan the code on the withdrawl page of the trading platform APP or wallet APP")}
                </p>
              </div>
              {networkAddress &&
                <>
                  <div className="text-center mb-3">
                    <QRCode size={250} value={networkAddress} renderAs="canvas" />
                  </div>
                  <div className="ms-2">
                    <p>{props.t(`Send only ${selectedWallet?.asset} to this deposit address.`)}</p>
                    <p>{props.t(`Ensure the network is ${networkName}.`)}</p>
                    <p>
                      {props.t("Do not send NFT to this address. Learn how to deposit NFTs")}
                    </p>
                  </div>
                </>}

              <div className="text-center mt-4">
                <Button
                  className="btn btn-primary mx-2 btn-sm w-lg"
                  onClick={() => { dispatch(toggleCurrentModal("selectDepositMethodModal")) }}
                >
                  {props.t("Back")}
                </Button>
                <Button
                  className="btn btn-success waves-effect waves-light w-lg btn-sm"
                  onClick={() => toggleOpen()}
                >
                  {props.t("Continue")}
                </Button>
              </div>
            </Form>
          </div>
        </>
      ),
    },
  ];
  // { header: "Copy Address", content: <>No design</> }]
  return (
    <CustomModal
      steps={steps}
      isOpen={isOpen}
      toggleOpen={toggleOpen}
      activeStep={activeStep}
      toggleTab={toggleTab}
    ></CustomModal>
  );
}
export default withTranslation()(CryptoDeposit); 
