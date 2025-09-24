import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AvForm } from "availity-reactstrap-validation";
import {
  CardBody, CardTitle, Button, Modal, ModalHeader
} from "reactstrap";
import { useTranslation } from "react-i18next";
import { submitIndProfile } from "store/general/auth/profile/actions";
import { Accordion, CloseButton } from "react-bootstrap";
import Personnels from "./Personnels";
import GeneralInfo from "./GeneralInfo";
import {
  CLIENT_AGREEMENT, COUNTRY_REGULATIONS, E_SIGNATURE
} from "declarations";
import AuthorizedPerson from "./AuthorizedPerson";
import Declerations from "./Declerations";


const CorpProfile = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { submittingProfile, clientData: { _id: clientId } } = useSelector((state) => state.Profile);
  const [sameAddress, setSameAddress] = useState(false);

  return (<>
    <Modal
      isOpen={props.isOpen}
      toggle={props?.toggle}
      centered={true}
      size="lg"
      className='custom-modal'
      style={{
        overflow: "hidden",
        background: "transparent",
      }}
    >
      <ModalHeader className="d-flex flex-column gap-3">
        <CloseButton
          onClick={props?.toggle}
          style={{
            alignSelf: "flex-end",
            position: "absolute",
            right: 10,
            top: 10
          }}
        />
        <div className="text-center">
          <CardTitle className="mb-0">{t("Update Corporate Profile")}</CardTitle>
        </div>
      </ModalHeader>
      <CardBody
        style={{
          overflow: "auto",
          padding: 20,
        }}
      >
        {clientId &&
          <AvForm
            onValidSubmit={(e, v) => {
              v.declarations = [CLIENT_AGREEMENT, COUNTRY_REGULATIONS, E_SIGNATURE];
              delete v.agreement;
              delete v.regulations;
              delete v.signature;
              if (sameAddress) {
                const hqAddress = {
                  address: v.address,
                  city: v.city,
                  country: v.country,
                  zipCode: v.zipCode,
                };
                v.corporateInfo = {
                  ...v.corporateInfo,
                  hqAddress,
                };
              }
              dispatch(submitIndProfile(v));
              props.toggle();
            }}
          >
            <Accordion>
              <GeneralInfo sameAddress={sameAddress} setSameAddress={setSameAddress} />
              <Personnels />
              <AuthorizedPerson />
              <Declerations />
            </Accordion>

            <div className="d-flex justify-content-end">
              <div className="p-4">
                <Button
                  disabled={submittingProfile}
                  type="submit"
                  color="primary"
                >
                  {t("Submit")}
                </Button>
              </div>
            </div>
          </AvForm>
        }
      </CardBody>
    </Modal>
  </>);
};

export default CorpProfile; 