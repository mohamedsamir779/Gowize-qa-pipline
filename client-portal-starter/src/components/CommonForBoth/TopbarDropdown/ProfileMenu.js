import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  Spinner,
} from "reactstrap";

//i18n
import { withTranslation } from "react-i18next";
// Redux
import {
  connect, useDispatch, useSelector
} from "react-redux";
import {
  withRouter, Link, useHistory
} from "react-router-dom";

// users
// import user1 from "../../../assets/images/users/avatar-1.jpg";
import { fetchProfile } from "store/actions";
import { imagesUrl } from "content";

const ProfileMenu = props => {
  // Declare a new state variable, which we'll call "menu"
  const [menu, setMenu] = useState(false);

  const dispatch = useDispatch();
  const history = useHistory();
  const { clientData } = useSelector(state => state.Profile);
  const [avatarImage, setAvatarImage] = useState(clientData?.profileAvatar ? { preview: `${imagesUrl}/${clientData?.profileAvatar}` } : null);
  const { layoutMode } = useSelector(state => state.Layout);
  useEffect(() => {
    dispatch(fetchProfile({ history }));
  }, []);

  useEffect(() => {
    dispatch(fetchProfile({ history }));

    if (clientData && clientData?.profileAvatar) {
      setTimeout(() => {
        setAvatarImage({ preview: `${clientData?.profileAvatar}` });
      }, 100);
    } else {
      setTimeout(() => {
        setAvatarImage(null);
      }, 100);
    }
  }, [clientData?.profileAvatar]);

  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="d-inline-block"
      >
        <DropdownToggle
          className="btn header-item"
          id="page-header-user-dropdown"
          tag="button"
        >
          {clientData.firstName && clientData.firstName ?
            <button type="button" className="btn btn-light position-relative rounded-circle" style={{
              width: "3rem",
              height: "3rem"
            }}>
              {avatarImage && (<img className="avatar-title header-avatar-image" src={avatarImage?.preview} />)}
              {!avatarImage && (<span className="avatar-title bg-transparent text-reset fs-5">
                {clientData.firstName[0]}{clientData.lastName?.[0]}
              </span>)}
            </button>
            : <Spinner></Spinner>}
          <i className="mdi mdi-chevron-down d-none d-xl-inline-block ms-1" />
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <Link to="/profile" className="dropdown-item">
            <i className="bx bx-user font-size-16 align-middle me-1"
              style={{
                color: layoutMode === "dark" ? "#F89622" : ""
              }}
            />
            <span>{props.t("Profile")}</span>
          </Link>
          <Link to="/notifications" className="dropdown-item">
            <i className="bx bx-bell font-size-16 align-middle me-1" style={{
              color: layoutMode === "dark" ? "#F89622" : ""
            }} />
            <span>{props.t("Notifications")}</span>
          </Link>
          <div className="dropdown-divider" />
          <Link to="/logout" className="dropdown-item">
            <i className="bx bx-power-off font-size-16 align-middle me-1 text-danger" style={{
              color: layoutMode === "dark" ? "#F89622" : ""
            }} />
            <span>{props.t("Logout")}</span>
          </Link>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

ProfileMenu.propTypes = {
  success: PropTypes.any,
  t: PropTypes.any
};

const mapStatetoProps = state => {
  const { error, success } = state.Profile;
  return {
    error,
    success
  };
};

export default withRouter(
  connect(mapStatetoProps, {})(withTranslation()(ProfileMenu))
);
