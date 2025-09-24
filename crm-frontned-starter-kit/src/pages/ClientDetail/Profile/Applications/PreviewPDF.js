import {
  Button,
  Modal, ModalBody, ModalHeader
} from "reactstrap";
import Pdf from "./Pdf";
import useModal from "hooks/useModal";

const PreviewPDF = ({ heading, isIb }) => {
  const [show, toggle] = useModal();
  return (
    <>
      <Button onClick={toggle} size="sm" color="primary" className="me-2">
        Preview
      </Button>
      <Modal size="xl" toggle={toggle} isOpen={show}>
        <ModalHeader toggle={toggle} >Preview Application</ModalHeader>
        <ModalBody>
          <Pdf heading={heading} isIb={isIb}/>
        </ModalBody>
      </Modal>
    </>
  );
};

export default PreviewPDF;