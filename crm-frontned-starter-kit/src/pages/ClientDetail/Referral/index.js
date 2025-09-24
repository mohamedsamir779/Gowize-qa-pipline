import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { withTranslation } from "react-i18next";
import { 
  Container, 
  Card, 
  Button
} from "react-bootstrap";
import {
  Table, Thead, Tbody, Tr, Th
} from "react-super-responsive-table";
import { AvForm } from "availity-reactstrap-validation";

import { fetchReferrals } from "store/client/actions";
import { fetchAgreements } from "store/actions";

import RecursiveTableRows from "./RecursiveTableRows";
import Select from "react-select";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import CustomSelect from "components/Common/CustomSelect";

const Referral = ({ t }) => {
  const dispatch = useDispatch();

  const { _id, referrals } = useSelector((state) => state.clientReducer?.clientDetails);
  const { agreements } = useSelector((state) => state.ibAgreements);

  const [selectedAgreement, setSelectedAgreement] = useState(null);

  useEffect(() => {
    if (_id) {
      _id && dispatch(fetchReferrals({
        type: "live",
        clientId: _id
      }));
      dispatch(fetchAgreements({ customerId: _id }));
    }
  }, [_id]);
  return (
    <Container fluid className="gx-4">
      <AvForm className="d-flex">
        <div className="row m-2">
          <label className="color-primary">{t("Select Agreement")}</label>
          <CustomSelect
            className="w-full"
            name="agreement"
            onChange={(e) => { setSelectedAgreement(e.value) }}
            value={
              selectedAgreement === null ? "" : undefined
            }
            options={agreements?.map((agreement) => {
              return ({
                label: agreement.title,
                value: agreement._id,
              });
            })}
          />
        </div>
        <div className="row col-md-auto align-content-end m-2" >
          <Button onClick={()=>{
            setSelectedAgreement(null);
          }}>
            {t("Clear")}
          </Button>
        </div>
      </AvForm>
      
      <Card className="p-3 mt-4">
        {referrals &&
          <Table className="table table-hover text-center">
            <Thead>
              <Tr >
                <Th className="py-2 color-primary text-start">{t("Name")}</Th>
                <Th className="py-2 color-primary text-start">{t("Parent Name")}</Th>
                <Th className="py-2 color-primary">{t("Client Type")}</Th>
                <Th className="py-2 color-primary">{t("Accounts")}</Th>
              </Tr>
            </Thead>
            <Tbody>
              <RecursiveTableRows data={referrals[0]} filter={selectedAgreement} level={0} />
            </Tbody>
          </Table>}
      </Card>
    </Container >
  );
};

export default withTranslation()(Referral);
