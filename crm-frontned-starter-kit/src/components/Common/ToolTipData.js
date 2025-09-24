import React from "react";
import { Tooltip } from "reactstrap";

const ToolTipData = (props) => {
  const {
    data,
    placement = "top",
    target = "",
  } = props;
  const [tooltipOpen, setTooltipOpen] = React.useState(false);
  return (
    <Tooltip
      placement={placement}
      isOpen={tooltipOpen}
      target={target}
      toggle={() => {
        setTooltipOpen(!tooltipOpen);
      }}
    >
      {data}
    </Tooltip>
  );
};

export default ToolTipData;