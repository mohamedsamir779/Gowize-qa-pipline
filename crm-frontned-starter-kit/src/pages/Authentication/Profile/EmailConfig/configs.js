import SendGridForm from "./SendGridForm";
import SmtpForm from "./SmtpForm";

export const emailConfigs = [
  {
    title: "sendGrid",
    component: SendGridForm,
  },
  {
    title: "smtp",
    component: SmtpForm,
  },
];