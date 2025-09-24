import React, { useRef } from "react";
import ReactToPdf from "react-to-pdf";
import { useSelector } from "react-redux";
import { Button } from "reactstrap";
import Pdf from "./Pdf";

const GeneratePDF = (props) => {
  const { heading, isIb } = props;
  const {
    firstName,
    fx: { ibQuestionnaire },
  } = useSelector((state) => state.Profile.clientData);


  const pdfRef = useRef(null);
  
  const handlePdfRef = (ref) => {
    pdfRef.current = ref;
  };
  return (
    <>
      <div className="hidden">
        <Pdf onPdfRef={handlePdfRef} heading={heading} isIb={isIb} toGenerate={true}/>
      </div >
      <ReactToPdf
        targetRef={pdfRef}
        filename={`${firstName}-${isIb ? "SubIb" : "Individual"}.pdf`}
        options={{
          orientation: "p",
          unit: "px",
          format: [1230, isIb && ibQuestionnaire ? 1800 : 1500]
        }}
        x={2}
        y={2}
        scale={1.5}>
        {({ toPdf }) => (
          <Button
            size="sm"
            color="primary"
            onClick={toPdf}>
            Download
          </Button>
        )}
      </ReactToPdf>
    </>

  );
};

export default GeneratePDF;
