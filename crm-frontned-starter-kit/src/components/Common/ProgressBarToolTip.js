import React from "react";
import {
  OverlayTrigger, ProgressBar, Tooltip
} from "react-bootstrap";

function ProgresBarTooltip({ achieved = 0, target = 100 }) {
  const renderTooltip = (achieved, target) => (
    <Tooltip id="button-tooltip">
      {`${achieved} / ${target}`}
    </Tooltip>
  );

  return (
    <OverlayTrigger
      placement="top"
      delay={{
        show: 250,
        hide: 350
      }}
      overlay={renderTooltip(achieved, target)}
    >
      <ProgressBar
        label={target > 0 ? `${Math.round(achieved / target * 100)}%` : ""}
        now={achieved}
        max={target}
      />
    </OverlayTrigger>
  );
}

export default ProgresBarTooltip;