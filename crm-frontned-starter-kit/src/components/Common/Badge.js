import React from "react";

export default function Badge({ status }) {
  let badgeColor = "alert-";
  status = status.indexOf("_") > -1 ? status.replace("_", " ").toLowerCase() : status.toLowerCase();

  switch (status) {
    case "completed":
    case "approved":
    case "deposit":
    case "success":
    case "APPROVED":
      badgeColor += "success";
      break;
    case "pending":
    case "PENDING":
    case "internal transfer":
      badgeColor += "warning";
      break;
    case "failed":
    case "withdraw":
    case "rejected":
      badgeColor += "danger";
      break;
    default:
      badgeColor += "light";
  }

  return (
    <span className={`w-md-50 m-auto py-0 alert text-capitalize ${badgeColor}`}
    >{status}</span>
  );
}