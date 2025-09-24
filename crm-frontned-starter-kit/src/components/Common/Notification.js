import React from "react";
import "./NotifactionStyles.scss";
function Notification({ show = false, body, header, time, onClose, logo }){
  return (
    <React.Fragment>
      {show && 
          <div className="notifaction-modal toast fade show" role="alert" id="notifaction-modal">
            <div className="toast-header">
              <img src={logo} alt="" className="me-2" height="18" />
              <strong className="me-auto">{header}</strong>
              <small>{time}</small>
              <button onClick={onClose} type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div className="toast-body">
              { body }
            </div>
          </div>
        
      }
    </React.Fragment>
   
  );
}
export default Notification;