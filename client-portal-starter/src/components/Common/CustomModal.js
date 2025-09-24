import React, {  } from "react";
import { Modal } from "reactstrap";
import classnames from "classnames";

function CustomModal({ steps, isOpen, toggleOpen, activeStep, size = "lg" }) {
  return (
    <Modal
      isOpen={isOpen}
      centered={true}
      size={size}
      className='custom-modal'
      // toggle={toggleOpen}
    >
      <div className="modal-steps">
        {steps.map((step, index) =>
          <div key={index} className={classnames("step", { active: activeStep === index })} onClick={() => {}}>
            <button type="button" className={"btn btn-light btn-rounded number"} onClick={() => { }}>{index + 1}</button>
            <span className={(activeStep == index) ? "text text-white" : "text"}>{step.header}</span>
            {steps.length - 1 !== index && <div className="vl">
              <div className="vl-1"></div>
              <div className="vl-2"></div>
              <div className="vl-3"></div>
            </div>}
          </div>
        )}
      </div>
      <div className="modal-header">
        <button
          type="button"
          className="close btn btn-soft-dark waves-effect waves-light btn-rounded m-4"
          data-dismiss="modal"
          aria-label="Close"
          onClick={toggleOpen}
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
        {steps[activeStep]?.content}
      </div>
    </Modal>);
}

export default CustomModal;