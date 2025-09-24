import React, {
  useEffect, useMemo, useState
} from "react";
import SumsubWebSdk from "@sumsub/websdk-react";
import { useSelector } from "react-redux";
import { generateSDK } from "apis/sumsub";

export default function Sumsub() {
  const [accessSDKToken, setAccessSDKToken] = useState("");

  const { email, language, _id } = useSelector(state => state.Profile.clientData);

  const handler = () => Promise.resolve("");

  useEffect(() => {
    _id && generateSDK(_id).then(({ token }) => setAccessSDKToken(token)).catch((error) => console.log(error));
  }, [_id]);

  useEffect(() => {
    console.log(accessSDKToken, _id);
  }, [accessSDKToken]);
  
  const config = useMemo(
    () => ({
      lang: language,
      email: email,
      i18n: {
        document: {
          subTitles: {
            IDENTITY: "Upload a document that proves your identity",
          },
        },
        status: {
          pendingTitle:
            "Thank you. \n\n You have completed the identity verification process.",
          pendingText:
            " The verification status will update below automatically. You can now close this page. We will follow-up with you if we need anything else or have any questions.",
        },
      },
      onMessage: (type, payload) => {
        console.log("WebSDK onMessage", type, payload);
      },
      onError: (error) => {
        console.error("WebSDK onError", error);
      },
    }),
    [email]
  );

  useEffect(() => {
    config.email = email;
  }, [email, config]);

  const options = {
    addViewportTag: false,
    adaptIframeHeight: true
  };

  const messageHandler = (type, payload) => {
    console.log("onMessage: ", type, payload);
  };

  const errorHandler = (data) => console.log("onError: ", data);

  console.log(accessSDKToken);

  return (
    <div>
      {accessSDKToken && <SumsubWebSdk
        accessToken={accessSDKToken}
        expirationHandler={handler}
        config={config}
        options={options}
        onMessage={messageHandler}
        onError={errorHandler}
      />}
    </div>
  );
}
