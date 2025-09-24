import {
  AvField,
  AvForm
} from "availity-reactstrap-validation";
import React, { useEffect } from "react";
import Actions from "./Actions";
import { useTranslation } from "react-i18next";
import TableLoader from "components/Common/Loader";
import { useSelector } from "react-redux";
import { Input, Label } from "reactstrap";

export default function SmtpForm(props) {
  const {
    submitHandler,
  } = props;
  const { smtp } = useSelector((state) => state.systemEmailConfigReducer?.configs);
  const { loading, currentProvider } = useSelector((state) => state.systemEmailConfigReducer);
  const [state, dispatch] = React.useReducer((state, action) => {
    switch (action.type) {
      case "server":
        return {
          ...state,
          server: action.payload,
        };
      case "port":
        return {
          ...state,
          port: action.payload,
        };
      case "user":
        return {
          ...state,
          user: action.payload,
        };
      case "password":
        return {
          ...state,
          password: action.payload,
        };
      case "secure":
        return {
          ...state,
          secure: action.payload,
        };
      case "fromEmail":
        return {
          ...state,
          fromEmail: action.payload,
        };
      case "init":
        return {
          server: action.payload.server,
          port: action.payload.port,
          user: action.payload.user,
          password: action.payload.password,
          secure: action.payload.secure,
          fromEmail: action.payload.fromEmail,
        };
      default:
        return state;
    }
  }, {
    server: smtp?.server,
    port: smtp?.port,
    user: smtp?.user,
    password: smtp?.password,
    secure: smtp?.secure,
    fromEmail: smtp?.fromEmail,
  });
  useEffect(() => {
    dispatch({
      type: "init",
      payload: smtp,
    });
  }, [smtp]);

  const { t } = useTranslation();
  return (
    <div className="m-3">
      <h4>{t("smtp")}</h4>
      <AvForm className="m-3"
        onValidSubmit={(_, values) => submitHandler(values)}
      >
        <AvField
          name="fromEmail"
          label="Email"
          type="text"
          errorMessage="Invalid Email"
          defaultValue={state?.fromEmail}
          onChange={(e) => dispatch({
            type: "fromEmail",
            payload: e.target.value,
          })}
          validate={{
            required: { value: true },
          }}
        />
        <AvField
          name="server"
          label="Host"
          type="text"
          errorMessage="Invalid Host"
          defaultValue={state?.server}
          onChange={(e) => dispatch({
            type: "server",
            payload: e.target.value,
          })}
          validate={{
            required: { value: true },
          }}
        />
        <AvField
          name="port"
          label="Port"
          type="number"
          defaultValue={state?.port}
          onChange={(e) => dispatch({
            type: "port",
            payload: parseInt(e.target.value),
          })}
          errorMessage="Invalid Port"
          validate={{
            required: { value: true },
          }}
        />
        <AvField
          name="user"
          label="Username"
          type="text"
          defaultValue={state?.user}
          onChange={(e) => dispatch({
            type: "user",
            payload: e.target.value,
          })}
          errorMessage="Invalid Username"
          validate={{
            required: { value: true },
          }}
        />
        <AvField
          name="password"
          label="Password"
          type="password"
          defaultValue={state?.password}
          onChange={(e) => dispatch({
            type: "password",
            payload: e.target.value,
          })}
          errorMessage="Invalid Password"
          validate={{
            required: { value: true },
          }}
        />
        <Label>Security</Label>
        <div className="text-center">
          <Input type="checkbox" id={"id"} switch="none"
            checked={state?.secure}
            onChange={(e) => dispatch({
              type: "secure",
              payload: e.target.checked,
            })}
          />
          <Label className="me-1" htmlFor={"id"} data-on-label="" data-off-label=""></Label>
        </div>
        {
          loading ? <TableLoader/> : <Actions 
            t={t}
            submitHandler={(type) => submitHandler(state, type)}
            isMakeActiveEnabled={currentProvider !== "smtp"}
            isTestEnabled={
              state?.server && state?.port && state?.user && state?.password && state?.fromEmail
            }
          />
        }
      </AvForm>
    </div>
  );
}