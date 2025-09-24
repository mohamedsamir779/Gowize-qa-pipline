import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MetaTags } from "react-meta-tags";
import { withTranslation } from "react-i18next";
import { Container } from "react-bootstrap";
import {
  Table, Thead, Tbody, Tr, Th
} from "react-super-responsive-table";

import { fetchAgreements, fetchReferrals } from "store/actions";

import CardWrapper from "components/Common/CardWrapper";
import RecursiveTableRows from "./RecursiveTableRows";
import Select from "react-select";
import PageHeader2 from "components/Forex/Common/pageHeader2";
import IbNotApproved from "components/Common/IbNotApproved";
import Loader from "components/Common/Loader";
import { Button } from "reactstrap";
import CustomSelect from "components/Common/CustomSelect";

const Referral = ({ t }) => {
  const dispatch = useDispatch();

  const { agreements, loading } = useSelector((state) => state.forex.ib.agreements);
  const referrals = useSelector((state) => state.forex.ib.agreements.referrals);
  const { subPortal } = useSelector(state=>state.Layout);
  const partnershipAgreement = useSelector((state) => (state.Profile.clientData.stages?.ib?.partnershipAgreement));
  
  const [isIbPortal, ] = useState(subPortal === "IB");
  const [selectedAgreement, setSelectedAgreement] = useState(undefined);

  useEffect(() => {
    dispatch(fetchReferrals({
      type: "live",
    }));
    dispatch(fetchAgreements());
  }, []);

  return (
    <div className="page-content">
      <MetaTags>
        <title>{t("Referrals")}</title>
      </MetaTags>
      <Container className="mt-5">
        { isIbPortal && !partnershipAgreement && <IbNotApproved /> }
        <PageHeader2 title="Referrals" />
        <div className="container">
          <div className="row">
            <div className="col-4">
              <label>{t("Select Agreement")}</label>
              <CustomSelect
                className="w-full"
                name="agreement"
                onChange={(e) => { setSelectedAgreement(e.value) }}
                value={selectedAgreement ? selectedAgreement?.value : ""}
                options={agreements?.map((agreement) => {
                  return ({
                    label: agreement.title,
                    value: agreement._id,
                  });
                })}
              />
            </div>
            <div className="row col-md-auto align-content-end" >
              <Button className="color-bg-btn border-0" onClick={()=>{setSelectedAgreement(undefined)}}>
                {t("Clear")}
              </Button>
            </div>
          </div>
        </div>

        <CardWrapper className="p-3 mt-4 glass-card shadow">
          {loading ? <Loader /> : referrals.length > 0 &&
            <Table className="table table-hover text-center">
              <Thead>
                <Tr >
                  <Th className="py-2">{t("Name")}</Th>
                  <Th className="py-2">{t("Client Type")}</Th>
                  <Th className="py-2">{t("Accounts")}</Th>
                  <Th className="py-2">{t("Parent Name")}</Th>
                </Tr>
              </Thead>
              <Tbody>
                <RecursiveTableRows data={referrals[0]} filter={selectedAgreement} />
              </Tbody>
            </Table>}
        </CardWrapper>
      </Container >
    </div>
  );
};

export default withTranslation()(Referral);
