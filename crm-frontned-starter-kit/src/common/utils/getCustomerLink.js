import React from "react";
import { Link } from "react-router-dom";

export const getClientLink = (clientId = "", clientFirstName = "", clientLastName = "") => {
  return (
    <Link
      to={{
        pathname: "/clients/" + clientId + "/profile",
        state: { clientId }
      }}
    >
      <strong className="text-capitalize">{clientFirstName + " " + clientLastName}</strong>
    </Link>
  );
};

export const getLeadLink = (clientId = "", clientFirstName = "", clientLastName = "") => {
  return (
    <Link
      to={{
        pathname: "/clients/" + clientId + "/profile",
        state: { clientId }
      }}
    >
      <strong className="text-capitalize">{clientFirstName + " " + clientLastName}</strong>
    </Link>
  );
};