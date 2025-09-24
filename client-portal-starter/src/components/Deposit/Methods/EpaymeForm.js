import { useEffect } from "react";

function EpaymeForm({ result, setResult, setIsFirstStepValid }) {
  function loadScript(scriptURL, callback) {
    const script = document.createElement("script");
    script.src = scriptURL;
    script.async = true;
    script.onload = () => {
      if (callback) {
        callback();
      }
    };
    document.body.appendChild(script);
  }
  let Epay = null;
  const initiateEPaySDK = (url, callback) => {
    loadScript(url, () => {
      console.log("epay is ready");
      Epay = window.Epay;

      if (callback) {
        callback(Epay);
      }
    });
  };
  useEffect(()=>{
    setIsFirstStepValid(true);
  }, []);
  return ( <></> );
}

export default EpaymeForm;