import { useState } from "react";

const useModal = () => {
  const [show, setIsShowing] = useState(false);
  const toggle = () => setIsShowing(!show);
  return [show, toggle];
};
export default useModal;