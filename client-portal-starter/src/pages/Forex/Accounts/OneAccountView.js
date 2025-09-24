import Accounts from "../Dashboard/Accounts";
import { useDispatch, useSelector } from "react-redux";
import { toggleCurrentModal } from "store/actions";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { JClickHandler } from "components/Journey/handlers";

export default function OneAccountView({ handleAccountSelect, propsType }) {
  const history = useHistory();
  const [type, setType] = useState(propsType || "live");
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { accounts } = useSelector((state) => state.forex.accounts);
  const profileDetails = useSelector(state => state.Profile.clientData);

  const { type: paramType } = useParams();

  useEffect(() => {
    setType(paramType);
  }, [paramType]);
  
  const buttons = [
    {
      title: t(`Create new ${type} Account`),
      onClick: () => {
        if (
          profileDetails.stages.individual?.submitProfile ||
          type === "demo"
        ) {
          dispatch(toggleCurrentModal("CreateAccModal", type));
        } else {
          JClickHandler(
            "madeDeposit",
            profileDetails.stages,
            dispatch,
            toggleCurrentModal
          )();
        }
      },
      iconName: "icofont-plus-circle me-1",
      disabled: !profileDetails?.stages?.kycApproved,
    },
    // {
    //   title: t("Change Password"),
    //   onClick: () => history.push("/accounts/password"),
    //   iconName: "icofont-lock me-1",
    //   disabled: accounts === undefined || accounts?.length === 0,
    // },
    {
      title: t("Change Leverage"),
      onClick: () => dispatch(toggleCurrentModal("LeverageModal", accounts)),
      iconName: "icofont-exchange me-1",
      disabled: accounts === undefined || accounts?.length === 0,
    },
  ];
  return (
    <div className="forex-dashboard">
      <Accounts onAccountSelect={handleAccountSelect} isFromDashboard={false} buttons={buttons} type={type} setType={setType}  />
    </div>
  );
}
