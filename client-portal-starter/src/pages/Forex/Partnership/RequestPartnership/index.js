import CardWrapper from "components/Common/CardWrapper";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  Button, Container, Spinner 
} from "reactstrap";
import { requestPartnership, getIbRequestStatus } from "store/actions";

function RequestPartnership() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { loading, result, status, getStatusLoader } = useSelector(state=>state.forex.requests.partnership);
  useEffect(()=>{
    dispatch(getIbRequestStatus());
  }, []);

  return (<div className="page-content mt-5">
    <Container>
      <CardWrapper className="glass-card shadow-lg">
        <h4 className="border-bottom pb-2 color-primary">{t("Request Partnership")}</h4>
        <div className="text-center">
          {getStatusLoader ? <Spinner></Spinner> : status && status.length > 0 ? <>
            {status === "PENDING" && <h5 className="my-5">{t("Your Request under processing")}</h5>}
            {status === "APPROVED" && <h5 className="my-5">{t("Your Request has been approved")}</h5>}
            {status === "REJECTED" && <h5 className="my-5">{t("Your Request has been Rejected")}</h5>}
          </> : result ? <>
            <div>
              <i className="bx bx-check" style={{ fontSize:"80px" }}></i>
            </div>
            <h5 className="mb-3">
              {t("We have received your request for partnership. It can take upto 24 hours to process the Request.")}
            </h5>
          </> : <>
            <h5 className="my-5">
              {t("You don't have any partnership, Please click below to request partnership")}
            </h5>
            <Button className="color-bg-btn border-0" onClick={()=>{
              dispatch(requestPartnership());
            }} disabled={loading}>
              {loading ? <Spinner></Spinner> : t("Request For Partnership")}
            </Button>    
          </>}
        </div>        
      </CardWrapper>
    </Container>
  </div>);
}

export default RequestPartnership;