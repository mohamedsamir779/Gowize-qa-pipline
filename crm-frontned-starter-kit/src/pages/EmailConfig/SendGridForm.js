import { AvField, AvForm } from "availity-reactstrap-validation";
import React, { useEffect } from "react";
import Actions from "./Actions";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import TableLoader from "components/Common/Loader";

export default function SendGridForm(props) {
  const { t } = useTranslation();
  const {
    submitHandler,
  } = props;
  const [api, setApi] = React.useState("");
  const [senderEmail, setSenderEmail] = React.useState("");
  const { sendGrid } = useSelector((state) => state.systemEmailConfigReducer?.configs);
  const { loading, currentProvider } = useSelector((state) => state.systemEmailConfigReducer);

  useEffect(() => {
    setApi(sendGrid?.apiKey);
    setSenderEmail(sendGrid?.fromEmail);
  }, [sendGrid]);

  return (
    <div className="m-3">
      <h4>{t("sendGrid")}</h4>
      <AvForm className="m-3"
      >
        <AvField
          name="apiKey"
          label="API Key"
          type="text"
          value={api}
          defaultValue={sendGrid?.apiKey}
          onChange={(e) => setApi(e.target.value)}
          validate={{
            required: { value: true },
          }}
          errorMessage="Invalid API Key"
        />
        <AvField
          name="senderEmail"
          label="Sender Email"
          type="text"
          errorMessage="Invalid Sender Email"
          defaultValue={sendGrid?.fromEmail}
          value={senderEmail}
          onChange={(e) => setSenderEmail(e.target.value)}
          validate={{
            required: { value: true },
            validate: (value) => {
              const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
              return emailRegex.test(value);
            },
          }}
        />
        {
          loading ? <TableLoader/> : <Actions t={t} submitHandler={(type) => submitHandler({
            apiKey: api,
            senderEmail,
          }, type)} isTestEnabled={api && senderEmail} isMakeActiveEnabled={currentProvider !== "sendGrid"}
          />
        }
      </AvForm>
    </div>
  );
}