import CardWrapper from "components/Common/CardWrapper";
import { withTranslation } from "react-i18next";
import { Container } from "reactstrap";

const ForexFooter = (props) => {
  return (
    <Container className="my-4">
      <CardWrapper className="px-5 py-4 shadow glass-card" >
        <p className="text-secondary">
          {props.t(`High Risk Investment Warning: Trading foreign exchange on margin carries a high level of risk, and may not be suitable for all investors. The high degree of leverage can work against you as well as for you. Before deciding to
        trade foreign exchange you carefully consider your investment objectives, level of experience, experience, experience, and risk appetite. The possibility exists that you could sustain a loss of some or all initial investment and
        therefore you should not invest money that you cannot afford to lose. You should be aware of all the the risks associated with foreign exchange trading, and seek from an independent financial adviser if you have any doubts.`)}
        </p>
        <hr className="my-4 text-secondary"/>
        <span>&copy; {props.t("Copyright")} {new Date().getFullYear()} <img src="/logo.png" alt="Logo" height="50" width={100}/>, {props.t("All rights reserved")}.</span>
      </CardWrapper>
    </Container>
  );
};

export default withTranslation()(ForexFooter);