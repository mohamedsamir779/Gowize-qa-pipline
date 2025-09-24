import { PORTALS } from "common/constants";
import PageHeader from "components/Forex/Common/PageHeader";
import { useEffect } from "react";
import { withTranslation } from "react-i18next";
import { MetaTags } from "react-meta-tags";
import {
  useDispatch, connect, useSelector
} from "react-redux";
import { useHistory } from "react-router-dom";
import { Col, Row } from "reactstrap";
import {
  fetchProfile,
} from "store/actions";
import ProfileDetails from "./ProfileDetails";


function Profile(props) {
  const dispatch = useDispatch();
  const history = useHistory();

  const {
    clientData,
    loading,
  } = props.Profile;
  const { portal } = useSelector(state=>state.Layout);
  useEffect(() => {
    dispatch(fetchProfile({ history }));
  }, []);

  return (<>
    <MetaTags>
      <title>{props.t("My Profile")}</title>
    </MetaTags>
    <div className="page-content">
      <div className="mt-5 container">
        {portal === PORTALS.FOREX && <PageHeader title={props.t("My Profile")} />}
        <Row>
          <Col className="mt-4">
            <ProfileDetails clientData={clientData} loading={loading}></ProfileDetails>
          </Col>
        </Row>
      </div>
    </div>
  </>);
}
const mapStateToProps = (state) => {
  return {
    Profile: state.Profile,
    portal: state.Layout,
  };
};
export default connect(mapStateToProps, null)(withTranslation()(Profile)); 