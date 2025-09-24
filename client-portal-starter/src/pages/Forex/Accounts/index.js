import { useDispatch } from "react-redux";
import {
  Container
} from "reactstrap";
import MetaTags from "react-meta-tags";
import { withTranslation } from "react-i18next";

import Journey from "components/Journey/Journey";
import ClosedPosition from "./ClosedPositions";
import OpenPosition from "./OpenPosition";
import Transfers from "./Transfers";
import PageHeader from "components/Forex/Common/PageHeader";
import { useParams } from "react-router-dom";
import {
  getClosePositionsStart, getOpenPositionsStart, getTransfersStart
} from "store/actions";

import { useEffect, useState } from "react";
import OneAccountView from "./OneAccountView";

const LiveAccounts = (props) => {
  const { type } = useParams();
  const dispatch = useDispatch();
  const [id, setId] = useState(undefined);

  const onAccountSelect = (_id) => {
    setId(_id);
    dispatch(getOpenPositionsStart({ 
      _id,
      page: 1,
      limit: 10,
    }));
    dispatch(getClosePositionsStart({ _id }));
    dispatch(getTransfersStart({ tradingAccountId: _id }));
  };

  useEffect(() => {
    return () => {
      setId(undefined);
    };
  }, [type]);

  return (
    <>
      <MetaTags>
        <title>{props.t("Live Accounts")}</title>
      </MetaTags>

      <div className="page-content mt-5" style={{ marginBottom: "7.5%" }}>
        <Container fluid="lg">
          <PageHeader title={`${type === "live" ? "Live" : "Demo"} Accounts`}></PageHeader>
          {type === "live" &&
            <div className="mt-4">
              <Journey />
            </div>}
          <div className="pt-3">
            <OneAccountView handleAccountSelect={onAccountSelect} propsType={type} />
          </div>
          {/* <AC /> */}
          {type === "live" &&
            <Transfers accountId={id} />
          }
          <OpenPosition accountId={id} />
          <ClosedPosition accountId={id} />
        </Container>
      </div>
    </>
  );
};

export default withTranslation()(LiveAccounts);