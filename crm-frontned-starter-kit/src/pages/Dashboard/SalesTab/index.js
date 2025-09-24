import React from "react";

import SalesTarget from "./SalesTarget";
import LeadStats from "./LeadStats";
import SalesDedicatedLinks from "./SalesDedicatedLinks";


const Dashboard = () => (
  <>
    <LeadStats />
    <SalesTarget />
    <SalesDedicatedLinks />
  </>
);


export default Dashboard;