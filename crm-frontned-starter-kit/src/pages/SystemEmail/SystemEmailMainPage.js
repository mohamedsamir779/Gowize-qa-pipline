import React, { useState, useEffect } from "react";
import { 
  BrowserRouter as Router, Redirect, Route, Switch, useParams, useHistory
} from "react-router-dom";

import SystemEmailEdit from "./SystemEmailEdit";
import Loader from "components/Common/Loader";
import * as axiosHelper from "../../apis/api_helper";
import SystemEmailList from "./SystemEmailList";

function SystemEmailMainPage(props) {
  const pathParams = useParams();
  const history = useHistory();
  const systemEmailId = pathParams.id;
  const [systemEmail, setSystemEmail] = useState({
    loading: false,
    data: null,
    error: null,
  });

  const systemEmailFoundError = (error = new Error("System Email Not Found")) => {
    setSystemEmail({
      loading: false,
      data: null,
      error,
    });
    setTimeout(() => {
      history.push("/system-emails");
    }, 2000);
  };

  // getting system email details to check if it exists using its Id
  const getSystemEmailDetails = async(systemEmailId) => {
    try {
      setSystemEmail({ loading: true });
      const data = await axiosHelper.get(`/systememail/${systemEmailId}`);
      if (data && data.result) {
        setSystemEmail({
          loading: false,
          data 
        });
      } else {
        systemEmailFoundError();
        
      }
    } catch (error){
      systemEmailFoundError(error);
    }
  };

  useEffect(()=>{
    getSystemEmailDetails(systemEmailId);
  }, []);

  return (
    <React.Fragment>
      {systemEmail.loading && 
        <>
          <div className="page-content">
            <div className="container-fluid">
              {/* TODO make this loader centered */}
              <Loader />
            </div>
          </div>
        </>
      }
      {systemEmail.data && 
        <div className="page-content">
          <div className="container-fluid">
            {/* a router to navigate the user to system-emails/:<system email id>*/}
            <Router>
              {/* 
                if system email exists ie. the Id passed to the URL is correct
                then head to the requested route
                else redirect to dashboard
              */}
              <Switch>
                {
                  !props.fetchClientDetailsError
                    ?
                    <React.Fragment>
                      {/* system email edit */}
                      <Route exact path="/system-emails/:id">
                        <SystemEmailEdit role={systemEmail.data.result} />
                      </Route>

                      <Route exact path="/system-emails">
                        <SystemEmailList />
                      </Route>
                    </React.Fragment>
                    :
                    <Redirect to={"/dashboard"} />
                }
              </Switch>
            </Router>
          </div>
        </div>
      }
      {!systemEmail.loading && !systemEmail.data && <React.Fragment>
        <div className="page-content">
          <div className="container-fluid text-center">
            <h2>Data not found, please add your design logic here</h2>  
          </div>
        </div>
      </React.Fragment>}
    </React.Fragment>
  );
}

export default SystemEmailMainPage;
