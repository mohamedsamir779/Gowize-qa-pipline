import React from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";

const Authmiddleware = ({
  // I think it's done like this so we could use it as a placeholder later on
  component: Component,
  layout: Layout,
  isAuthProtected,
  get,
  ...rest
}) => (
  
  <Route
    {...rest}
    render={props => {
      
      //if user is not signed in 
      if (isAuthProtected && !localStorage.getItem("authUser")) {
        
        return (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location } 
            }}
          />
        );
      }
      else if (get === false){
        return (
          <Redirect
            to={{
              pathname: "*",
              state: { from: props.location } 
            }}
          />
        );
      }
      else 
        return (
          <Layout>
            <Component {...props} />
          </Layout>
        );
    }}
  />
);

Authmiddleware.propTypes = {
  isAuthProtected: PropTypes.bool,
  component: PropTypes.any,
  location: PropTypes.object,
  layout: PropTypes.any,
};

export default Authmiddleware;