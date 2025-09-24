import React, { useEffect } from "react";
import {
  Button,
  Col,
  Input,
  InputGroup,
  InputGroupText,
  Label,
  Row
} from "reactstrap";
import Select from "react-select";
import config from "config";
import QRCode from "qrcode.react";
import FeatherIcon from "feather-icons-react";
import { useDispatch } from "react-redux";
import { showSuccessNotification } from "store/actions";
import { AvForm, AvInput } from "availity-reactstrap-validation";

export default function CompanyCrypto({ t, setIsFirstStepValid, setPaymentPayload }) {
  const options = config.COMPANY_WALLETS.map((wallet) => {
    return {
      label: wallet.name,
      value: wallet
    };
  });
  const [coin, setCoin] = React.useState(null);
  const [network, setNetwork] = React.useState(null);
  const [walletAddress, setWalletAddress] = React.useState(null);
  const [transactionHash, setTransactionHash] = React.useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      setCoin(null);
      setNetwork(null);
    };
  }, []);

  useEffect(() => {
    if (walletAddress && transactionHash) {
      setIsFirstStepValid(true);
      setPaymentPayload({
        walletAddress,
        transactionHash,
        coin: coin.name,
        network: network.name
      });
    } else {
      setIsFirstStepValid(false);
      setPaymentPayload({});
    }
  }, [walletAddress, transactionHash]);

  return (
    <>
      <p className="text-muted">{t("Note the following Details")}</p>
      <Row>
        <Col md={12} className="my-3">
          <Label>{t("Coin")}</Label>
          <Select
            name="coin"
            onChange={(e) => setCoin(e.value)}
            required
            placeholder="Select Coin"
            options={options}
          >
          </Select>
        </Col>
        {
          coin && (
            <Col md={12}>
              <Label>{t("Network")}</Label>
              <Select
                name="network"
                onChange={(e) => setNetwork(e.value)}
                required
                placeholder="Select Network"
                options={coin?.networks.map((network) => {
                  return {
                    label: network.name,
                    value: network
                  };
                })}
              >
              </Select>
            </Col>
          )  
        }
        {
          network && (
            <>
              <Col md={12} className="my-3">
                <InputGroup>
                  <InputGroupText>
                    Address
                  </InputGroupText>
                  <Input
                    type="Address"
                    name="address"
                    value={network.address}
                    disabled
                  />
                  <br />
                  <div onClick={()=>{
                    navigator.clipboard.writeText(network.address);
                    dispatch(showSuccessNotification("Copied to clipboard"));
                  }} className="cursor-pointer d-flex justify-content-center align-items-center" style={{
                    padding: 10
                  }}
                  >
                    <FeatherIcon icon="copy" />
                  </div>
                </InputGroup>
              </Col>
              <Col md={12} >
                <div className="my-3 d-flex justify-content-center">
                  <QRCode
                    value={network.address}
                    size={256}
                    bgColor="#FFFFFF"
                    fgColor="#000000"
                    level="L"
                    includeMargin={false}
                    renderAs="svg"
                  />
                </div>
                
              </Col>
            </>
          )
        }
        {
          network && (
            <>
              <AvForm>
                <Col md={12} className="my-3">
                  <Label>{t("Your Wallet Address")}</Label>
                  <AvInput
                    type="text"
                    name="walletAddress"
                    onChange={(e) => setWalletAddress(e.target.value)}
                    label={t("Wallet Address")}
                    placeholder={t("Enter Wallet Address")}
                    required
                  />
                </Col>
                <Col md={12} className="my-3">
                  <Label>{t("Transaction Hash")}</Label>
                  <AvInput
                    type="text"
                    name="transactionHash"
                    onChange={(e) => setTransactionHash(e.target.value)}
                    label={t("Transaction Hash")}
                    placeholder={t("Enter Transaction Hash")}
                    required
                  />
                </Col>
              </AvForm>
            </>
          )
        }
      </Row>
    </>
  );
}
