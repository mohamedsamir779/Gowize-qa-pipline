import React, { useEffect, useState } from "react";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

import Todos from "./Todos";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { isCurrentUserManagerOfAssignedAgent } from "apis/teams";

function Notes() {
  const { clientId } = useParams();
  const { _id, roleId } = JSON.parse(localStorage.getItem("authUser"));
  const customer = useSelector((state) => state.clientReducer.clientDetails);
  const [isManager, setIsManager] = useState(null);

  useEffect(async () => {
    if (customer.agent?._id === undefined) return;
    // eslint-disable-next-line no-console
    setIsManager(await isCurrentUserManagerOfAssignedAgent(customer.agent._id).catch((err) => console.error(err)));
  }, [customer.agent?._id]);

  return (
    <>
      <Todos clientId={clientId} type={0} currentUserId={_id} />
      <Todos clientId={clientId} type={1} currentUserId={_id} />
      <Todos clientId={clientId} type={2} currentUserId={_id} />
      { (roleId.isAdmin || customer.agent?._id === _id || isManager) &&
        <Todos clientId={clientId} currentUserId={_id} type={3} />}
    </>
  );
}

export default Notes;
