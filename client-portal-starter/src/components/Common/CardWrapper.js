import React from "react";

function CardWrapper({ children, className, style }) {
  return (
    <div className={`card_wrapper ${className ? className : ""}`} style={style}>
      {children}
    </div>

  );
}

export default CardWrapper;