import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import {
  Button,
  Col,
  Input,
  Label,
  Modal, ModalBody, ModalHeader, Row
} from "reactstrap";
import { toggleCurrentModal } from "store/actions";
import { HIDE_JOU_OPEN_ACCOUNT } from "common/data/jourenykeys";

function SelectAccType({ isOpen, toggle }) {
  const { t } = useTranslation();
  const [type, setType] = useState("Live");
  const dispatch = useDispatch();
  return (<Modal centered isOpen={isOpen} toggle={toggle}>
    <ModalHeader toggle={toggle} tag="h4" className="text-capitalize">
      {t("Select account type")}
    </ModalHeader>
    <ModalBody className="px-4">
      <Row>
        <Col md="6">
          <div className="d-flex align-items-center border rounded-3 p-2 bg-light" onClick={()=>{ setType("Live")}}>
            <Input
              className="mt-0 me-2"
              id="live"
              name="accountType"
              type="radio"
              value="Live"
              checked={type === "Live"}
              onChange={(e)=>{
                if (e.checked)
                  setType("Live");
              }}
            >
            </Input>
            <Label check for="live">
              {t("Live")}
            </Label>
          </div>
        </Col>
        <Col md="6">
          <div className="d-flex align-items-center border rounded-3 p-2 bg-light" onClick={()=>{ setType("Demo")}}>
            <Input
              className="mt-0 me-2"
              id="Demo"
              name="accountType"
              type="radio"
              value="Demo"
              checked={type === "Demo"}
              onChange={(e)=>{
                if (e.checked)
                  setType("Demo");
              }}
            >
            </Input>
            <Label check for="Demo">
              {t("Demo")}
            </Label>
          </div>
        </Col>
        <Col>
          <div className="text-center mt-3">
            <Button onClick={()=>{
              localStorage.setItem(HIDE_JOU_OPEN_ACCOUNT, true);
              toggle();
            }} color="danger" className="w-lg waves-effect waves-light m-2">
              {t("Skip")}
            </Button>
            <Button onClick={()=>{
              dispatch(toggleCurrentModal("CreateAccModal", type));
              // toggle();
            }} color="success" className="w-lg waves-effect waves-light m-2">
              {t("Continue")}
            </Button>
          </div>
        </Col>
      </Row>
    </ModalBody>
  </Modal>
  );
}

export default SelectAccType;