import React, { Suspense, useEffect } from "react";
import { Switch, BrowserRouter as Router } from "react-router-dom";
import { connect, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment-timezone";

// Import Routes all
import { userRoutes, authRoutes } from "./routes/allRoutes";

// Import all middleware
import Authmiddleware from "./routes/middleware/Authmiddleware";

// layouts Format
import VerticalLayout from "./components/VerticalLayout/";
import HorizontalLayout from "./components/HorizontalLayout/";
import NonAuthLayout from "./components/NonAuthLayout";
import AppLoader from "./components/AppLoader";

// Import scss
import "./assets/scss/preloader.scss";
import "./assets/scss/theme.scss";
import { getProfileData } from "apis/auth";
import {
  changelayoutMode,
  receivedNotification,
  updatePushNotificationOption
} from "store/actions";
import { checkPushNotificationSubscription } from "serviceWorkerRegistration";
import formatReceivedNotification from "helpers/formatReceivedNotification";
import { IS_IOS } from "../src/constants";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
// import { default as themeRight } from "./assets/scss/theme-rtl.scss";
// import { default as themeLeft } from "./assets/scss/theme.scss";


const lang = localStorage.getItem("I18N_LANGUAGE");
if (lang === "ar") {
  import("./assets/scss/theme-rtl.scss");
}

// Import Firebase Configuration file
// import { initFirebaseBackend } from "./helpers/firebase_helper"
const channel = new BroadcastChannel("notification--exinitic--messages");

const App = props => {

  const dispatch = useDispatch();
  const history = useHistory();
  const notification = (!IS_IOS && Notification?.permission) || null;

  function getLayout() {
    let layoutCls = VerticalLayout;
    switch (props.layout.layoutType) {
      case "horizontal":
        layoutCls = HorizontalLayout;
        break;
      default:
        layoutCls = VerticalLayout;
        break;
    }
    return layoutCls;
  }
  const userArray = userRoutes();
  const Layout = getLayout(); // layout = layoutCls
  useEffect(() => { // remove token if not valid
    getProfileData()
      .then((user) => {
        user.isSuccess && moment.tz.setDefault(user.result?.settings?.timezone);
      })
      .catch(() => {
        localStorage.removeItem("authUser");
        history.push("/login");
      });
  }, []);

  channel.onmessage = (event) => {
    const formattedData = formatReceivedNotification(event.data);
    if (formattedData._id) {
      dispatch(receivedNotification(formattedData));
    }
  };

  useEffect(async () => {
    const checkCurrentNotification = await checkPushNotificationSubscription();
    dispatch(updatePushNotificationOption(checkCurrentNotification));
  }, [notification]);

  return (
    <React.Fragment>
      <Suspense fallback={<AppLoader />}>
        <Router>
          <Switch>
            {userArray.map((route, idx) => (
              <Authmiddleware
                path={route.path}
                layout={Layout}
                component={route.component}
                innerPages={route.innerPages}
                get={route.get}
                key={idx}
                isAuthProtected={true}
                {...(route.notExact ? {} : { exact: true })}
              />
            ))}
            {authRoutes.map((route, idx) => (
              <Authmiddleware
                path={route.path}
                layout={NonAuthLayout}
                component={route.component}
                key={idx}
                isAuthProtected={false}
                exact
              />
            ))}
          </Switch>
        </Router>
      </Suspense>
    </React.Fragment>
  );
};


App.propTypes = {
  layout: PropTypes.any
};

const mapStateToProps = state => {
  return {
    layout: state.Layout,
  };
};

export default connect(mapStateToProps, null)(App);
