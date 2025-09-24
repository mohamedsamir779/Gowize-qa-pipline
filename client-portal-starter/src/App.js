import {
  Suspense,
  useEffect,
} from "react";
import {
  useSelector,
  useDispatch,
} from "react-redux";
import { Switch, BrowserRouter as Router } from "react-router-dom";

import SocketProvider from "./context";

import Authmiddleware from "./routes/middleware/Authmiddleware";

import VerticalLayout from "./components/VerticalLayout/";
import NonAuthLayout from "./components/NonAuthLayout";
import AppLoader from "./components/AppLoader";

import forexRoutes from "./routes/forexRoutes";
import cryptoRoutes from "./routes/cryptoRoutes"; 
import { IS_IOS, PORTALS } from "common/constants";

import "./assets/scss/preloader.scss";
import "./assets/scss/theme.scss";
import {
  defaultPortal,
  enableCrypto,
  enableFX,
} from "config";
import { receivedNotification, updatePushNotificationOption } from "store/actions";
import { checkPushNotificationSubscription } from "serviceWorkerRegistration";
import formatReceivedNotification from "helpers/formatReceivedNotification";


const lang = localStorage.getItem("I18N_LANGUAGE");
if (lang === "ar") {
  import("./assets/scss/theme-rtl.scss");
}

const routeSelector = (portal) => {
  let defaultRoutes;
  switch (defaultPortal) {
    // case PORTALS.CRYPTO:
    //   defaultRoutes = cryptoRoutes;
    //   break;
    case PORTALS.FOREX:
      defaultRoutes = forexRoutes;
      break;
      default: defaultRoutes = forexRoutes;
      break;  
  }
  switch (portal) {
    // case PORTALS.CRYPTO:
    //   if (enableCrypto)
    //     return cryptoRoutes;
    //   else
    //     return defaultRoutes;
    case PORTALS.FOREX:
      if (enableFX)
        return forexRoutes;
      else
        return defaultRoutes;
    default: return defaultRoutes;
  }
};

const channel = new BroadcastChannel("notification--exinitic--messages");

const App = () => {
  const dispatch = useDispatch();
  const notification = (!IS_IOS && Notification?.permission) || null;

  const { portal } = useSelector((state) => state.Layout);
  let routes = routeSelector(portal);

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
    <SocketProvider>
      <Suspense fallback={<AppLoader />}>
        <Router>
          <Switch>
            {routes.map((route, idx) => (
              <Authmiddleware
                path={route.path}
                layout={route.isAuth ? VerticalLayout : NonAuthLayout}
                component={route.component}
                key={idx}
                isAuthProtected={route.isAuth ? true : false}
                exact
              />
            ))}
          </Switch>
        </Router>
      </Suspense>
    </SocketProvider>
  );
};
export default App;