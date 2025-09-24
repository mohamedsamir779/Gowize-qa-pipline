
// i18n
import { withTranslation } from "react-i18next";
import Loader from "components/Common/Loader";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "reactstrap";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import ToolTipData from "components/Common/ToolTipData";
import { useEffect, useState } from "react";
import { fetchClientsStart } from "store/client/actions";
import { fetchLeadsStart } from "store/leads/actions";

function ClientDetailsHeader() {
  const [kycStatus, setKycStatus] = useState("Pending");
  const {
    clientDetails,
    clientProfileloading,
    clients,
  } = useSelector(state => state.clientReducer);
  const {
    leads
  } = useSelector(state => state.leadReducer);

  const history = useHistory();

  useEffect(() => {
    if (clientDetails && clientDetails.stages) {
      if (!clientDetails.stages.kycUpload) setKycStatus("No Documents");
      else if (clientDetails.stages.kycRejected) setKycStatus("Rejected");
      else if (clientDetails.stages.kycApproved) setKycStatus("Verified");
      else setKycStatus("Pending Verification");
    }

  }, [clientDetails]);
  /**
   * 
   * {
  "madeDeposit":false,
  "emailVerified":false,
  "phoneVerified":false,
  "individual":{
  "updateProfile":false,
  "startTrading":false
  }
  }
  * 
  */

  const getPreviousNextButtons = () => {
    const dispatch = useDispatch();
    const {
      page: currentPage,
      hasNextPage,
      limit
    } = useSelector((state) => state.clientReducer);
    const {
      page: currentPageLead,
      hasNextPage: hasNextPageLead,
      limit: limitLead
    } = useSelector((state) => state.leadReducer);
    
    const isLead = clientDetails?.isLead || false;
    const dataList = isLead ? leads : clients;

    useEffect(() => {
      if (dataList.findIndex(data => data._id === clientDetails._id) === dataList.length - 1) {
        if (isLead && hasNextPageLead) {
          dispatch(fetchLeadsStart({
            page: 1,
            limit: limitLead + 10 * currentPageLead,
          }));
        } else if (!isLead && hasNextPage) {
          dispatch(fetchClientsStart({
            page: 1,
            limit: limit + 10 * currentPage,
          }));
        }
      }
    }, [clientDetails]);

    return (
      <>
        <div className="d-flex justify-content-between align-items-center mx-2">
          <div>
            <Button
              color="primary"
              id="tooltip-previous"
              disabled={dataList.findIndex(data => data._id === clientDetails._id) === 0 || dataList.length === 0}
              onClick={() => {
                const index = dataList.findIndex(data => data._id === clientDetails._id);
                if (index !== -1) {
                  const prevData = dataList[index - 1];
                  history.push(`/clients/${prevData._id}/profile`);
                }
              }}
            >
              {"<"}
              <ToolTipData
                target={"tooltip-previous"}
                placement="right"
                data={"Previous"}
              />
            </Button>
          </div>
          <p className="m-0 fs-4 fw-bold">{isLead ? "Lead" : "Client"}</p>
          <div>
            <Button
              color="primary"
              toolTip="Next"
              id="tooltip-next"
              disabled={dataList.findIndex(data => data._id === clientDetails._id) === dataList.length - 1 || dataList.length === 0}
              onClick={() => {
                const index = dataList.findIndex(data => data._id === clientDetails._id);
                if (index !== -1) {
                  const nextData = dataList[index + 1];
                  history.push(`/clients/${nextData._id}/profile`);
                }
              }}
            > {">"}
              <ToolTipData
                target={"tooltip-next"}
                placement="left"
                data={"Next"}
              /></Button>
          </div>
        </div>
      </>
    );
  };
  const getCategory = () => {
    let categories = [];
    if (clientDetails?.fx?.isClient){
      categories.push("individual");
    }
    if (clientDetails?.fx?.isIb){
      categories.push("ib");
    }
    return categories?.length > 0 ? categories.join(", ") : "N/A";
  };
  return (
    <>
      {getPreviousNextButtons()}
      <div className="row p-2 client-detail-header">
        <div className="hierarchy" >
          <div className="card-h-100 card card-animate">
            <div className="card-body">
              <div className="align-items-center">
                {clientProfileloading && <Loader />}
                {!clientProfileloading &&
                  <div >
                    <span className="text-muted mb-3 lh-1 d-block text-truncate">
                      Relation
                    </span>
                    <h6 className="mb-1">
                      <span className="counter-value">
                        {clientDetails.parentId
                          ? <span>Parent: <Link to={`/clients/${clientDetails.parentId._id}/profile`}
                          >{clientDetails.parentId.firstName} {clientDetails.parentId.lastName}
                          </Link></span>
                          : "Master"}
                      </span>
                      <span>
                        {"  "}| Current Level: {clientDetails.parentId?.level ?? 0}
                      </span>
                    </h6>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
        <div className="name" >
          <div className="card-h-100 card card-animate">
            <div className="card-body">
              <div className="align-items-center">
                {clientProfileloading && <Loader />}
                {!clientProfileloading &&
                  <div >
                    <span className="text-muted mb-3 lh-1 d-block text-truncate">
                      {clientDetails.recordId}
                    </span>
                    <h6 className="mb-1">
                      <span className="counter-value">
                        {`${clientDetails.firstName}  ${clientDetails.lastName ? clientDetails.lastName : ""}`}
                      </span>
                    </h6>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
        <div className="date">
          <div className="card-h-100 card card-animate">
            <div className="card-body">
              <div className="align-items-center row">
                {clientProfileloading && <Loader />}
                {!clientProfileloading &&
                  <div >
                    <span className="text-muted mb-3 lh-1 d-block text-truncate">
                      Created on
                    </span>
                    <h6 className="mb-1">
                      <span className="counter-value">
                        {clientDetails.createdAt ? (clientDetails.createdAt).split("T")[0] : " "}
                      </span>
                    </h6>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
        <div className="status">
          <div className="card-h-100 card card-animate">
            <div className="card-body">
              <div className="align-items-center row">
                {clientProfileloading && <Loader />}
                {!clientProfileloading &&
                  <>
                    <div className="">
                      <span className="text-muted mb-3 lh-1 d-block text-truncate">
                        Status
                      </span>
                      <h6 className="mb-1">
                        <span className="counter-value">
                          {clientDetails.isActive ? "Active" : "Inactive"}
                        </span>
                      </h6>
                    </div>
                  </>
                }
              </div>
            </div>
          </div>
        </div>
        <div className="category">
          <div className="card-h-100 card card-animate">
            <div className="card-body">
              <div className="align-items-center row">
                {clientProfileloading && <Loader />}
                {!clientProfileloading &&
                  <>
                    <div className="">
                      <span className="text-muted mb-3 lh-1 d-block text-truncate">
                        Category
                      </span>
                      <h6 className="mb-1">
                        <span className="counter-value">
                          {getCategory()}
                        </span>
                      </h6>
                    </div>
                  </>
                }
              </div>
            </div>
          </div>
        </div>
        <div className="stage">
          <div className="card-h-100 card card-animate">
            <div className="card-body">
              <div className="align-items-center row">
                {clientProfileloading && <Loader />}
                {!clientProfileloading &&
                  <div >
                    <span className="text-muted mb-3 lh-1 d-block text-truncate">
                      KYC Status
                    </span>
                    <h6 className="mb-1">
                      <span className="counter-value">
                        {kycStatus}
                      </span>
                    </h6>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </ >
  );
}

export default (withTranslation()(ClientDetailsHeader));
