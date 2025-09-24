import { useRef } from "react";
import { Button } from "reactstrap";
import { useSelector } from "react-redux";
import ReactToPdf from "react-to-pdf";
import Pdf from "./Pdf";

const GeneratePDF = ({ heading, isIb }) => {
  const {
    firstName,
    fx: { ibQuestionnaire },
  } = useSelector((state) => state.clientReducer.clientDetails);

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
