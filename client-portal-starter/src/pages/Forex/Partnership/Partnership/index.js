import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MetaTags } from "react-meta-tags";
import { useTranslation } from "react-i18next";
import { Container } from "reactstrap";
import Select from "react-select";

import { fetchAgreements, getAccountTypesStart } from "store/actions";
import PageHeader2 from "components/Forex/Common/pageHeader2";
import DedicatedLinks from "./DedicatedLinks";
import AgreementDetails from "./AgreementDetails";
import IbNotApproved from "components/Common/IbNotApproved";

function Partnership() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { recordId } = useSelector((state) => state.Profile?.clientData);
  const { agreements } = useSelector((state) => state.forex.ib.agreements);
  const { accountTypes } = useSelector((state) => state.forex.accounts);
  const { subPortal } = useSelector(state => state.Layout);
  const partnershipAgreement = useSelector((state) => (state.Profile.clientData.stages?.ib?.partnershipAgreement));

  const [selectedAgreement, setSelectedAgreement] = useState({});
  const [isIbPortal, ] = useState(subPortal === "IB");

  useEffect(() => {
    dispatch(fetchAgreements());
    dispatch(getAccountTypesStart());
  }, []);

  useEffect(() => {
    agreements && setSelectedAgreement(agreements[0]);
  }, [agreements]);

  return (
    <>
      <MetaTags>
        <title>{t("Partnership")}</title>
      </MetaTags>
      <div className="page-content">
        <Container className="mt-5">
          {isIbPortal && !partnershipAgreement && <IbNotApproved />}
          <PageHeader2 title="Partnership" />
          {selectedAgreement && <>
            
            <Select
              name="agreement"
              className="w-25"
              defaultValue={{ label: selectedAgreement?.title }}
              options={agreements?.map(agreement => {
                return {
                  label: agreement.title,
                  value: agreement,
                };
              }
              )}
              onChange={(e) => setSelectedAgreement(e.value)}
            /></>}
          <DedicatedLinks parentRef={recordId} agRef={selectedAgreement?.recordId} />
          <AgreementDetails agreement={selectedAgreement} accountTypes={accountTypes} />
        </Container>
      </div>
    </>
  );
}

export default Partnership;