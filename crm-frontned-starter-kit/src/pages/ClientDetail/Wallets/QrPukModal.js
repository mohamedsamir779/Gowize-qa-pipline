import React, { useEffect, useState } from "react";
import { 
  Modal, 
  ModalHeader, 
  ModalBody, 
  Col, 
  Row 
} from "reactstrap";
import FeatherIcon from "feather-icons-react";
import QRCode from "qrcode.react";
// i18n
import { useTranslation, withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { showErrorNotification, showSuccessNotification } from "store/notifications/actions";
import { useDispatch } from "react-redux";
import Select from "react-select";

function NetworksListSelect({ networks, ...props }) {
  const { t } = useTranslation();
  const [options, setOptions] = useState([]);
  console.log("Given Networks: ", networks);
  useEffect(() => {
    networks.filter(n => n).map((network, index) => {
      setOptions(options => {
        options[index] = {
          value: network.address,
          label: network.label,
        };
        return options;
      });
    });
  }, [networks]);

  return (
    <Select
      options={options}
      styles={{
        menuPortal: base => ({
          ...base,
          width: "200px",
        }),
        singleValue: (styles) => ({
          ...styles,
          maxWidth: "192px",
        }),
        option: (styles) => ({
          ...styles, 
        }),
      }}
      placeholder={t("Select Network")}
      {...props}
    />
  );
}

function QrPukModal(props) {
  const { open, puk = {}, onClose } = props;
  const dispatch = useDispatch();
  const {
    networks,
    networkDetails
  } = puk;
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [, setCopy] = useState("Copy Address");
  const CopyPuk = () => { 
    if (selectedNetwork) {
      navigator.clipboard.writeText(selectedNetwork.value);
      setCopy("Copied");
      return dispatch(showSuccessNotification("Copied"));
    }
    dispatch(showErrorNotification("Select a network"));
  };

  useEffect(() => {
    setCopy("Copy Address");
    if (networks?.length === 1) {
      const networkDetail = networkDetails.find(n => n.chainId === networks[0].chainId);
      setSelectedNetwork({
        value: networks[0].address,
        label: networkDetail.name,
      });
    }
    return () => {
      setCopy("Copy Address");
      setSelectedNetwork("");
    };
  }, [open]);

  return (
    <React.Fragment>
      <Modal isOpen={open} toggle={onClose} centered={true}>
        <ModalHeader toggle={onClose} tag="h4">
          {props.t("Address")}
        </ModalHeader>
        <ModalBody>
          <div className="container">
            <Row className=" ">
              <Col className="">
                <Row>
                  {
                    networks?.length > 1 && (
                      <NetworksListSelect
                        className="h-50 w-100"
                        noOptionsMessage={({ inputValue }) => !inputValue && "Select a coin first"}
                        onChange={(e)=> setSelectedNetwork(e)}
                        networks={
                          networks?.map((network) => {
                            console.log(networkDetails);
                            const networkDetail = networkDetails.find(n => n.chainId === network.chainId);
                            if (!networkDetail) {
                              console.log("Missing network detail", network);
                              return;
                            }
                            return {
                              ...network,
                              value: network.address,
                              label: `${networkDetail?.name}`,
                            };
                          }) || []
                        }
                      >
                      </NetworksListSelect>
                    )
                  }
                </Row>
                {
                  selectedNetwork && (<div className="mt-3 d-flex justify-content-center">
                    <QRCode size={300} value={selectedNetwork.value} renderAs="canvas" />
                  </div>
                  )
                }
              </Col>
            </Row>
            <br />
            <br />
            <Row>
              {selectedNetwork && "You have selected the following network: " + selectedNetwork.label}
              <Col md="9" style={{ wordWrap: "break-word" }}  >
                {selectedNetwork && selectedNetwork.value} 
              </Col>
              <Col md="3" className="d-flex justify-content-center ">
                {selectedNetwork && (<>
                  <Link to="#" onClick={CopyPuk}>
                    <FeatherIcon icon="copy" />
                  </Link>
                </>)}
                <br/>
              </Col>
            </Row>
          </div>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
}

export default withTranslation()(QrPukModal);
