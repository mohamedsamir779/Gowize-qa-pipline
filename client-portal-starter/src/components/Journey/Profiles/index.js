import { useSelector } from "react-redux";
import SubmitIndvidualProfile from "./IndvidualProfile";
import CorpProfile from "./Corporate";

const Profiles = (props) => {
  const { isCorporate } = useSelector((state) => state.Profile.clientData);
  return (
    isCorporate ? <CorpProfile {...props} /> : <SubmitIndvidualProfile {...props} />
  );
};

export default Profiles;