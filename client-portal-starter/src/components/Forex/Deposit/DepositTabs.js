import { useDispatch, useSelector } from "react-redux";
import { toggleCurrentModal } from "../../../store/actions";
import { withTranslation } from "react-i18next";
import { JClickHandler } from "components/Journey/handlers";

function DepositTabs() {
  const dispatch = useDispatch();
  const { clientData } = useSelector((state) => state.Profile);
  return (
    <>
      <div className="d-flex justify-content-center align-items-center">
        {/* <button className="btn btn-soft-light waves-effect waves-light m-3 rounded bg-white shadow-sm"
          style={{ width:"150px" }}
          onClick={()=>{
            dispatch(toggleCurrentModal("cryptoDeposit"));
          }}
        >
          <img src="./img/crypto.png" width={50} height={55}></img>
        </button> */}
        <button className="btn btn-soft-light waves-effect waves-light m-3 rounded bg-white shadow-sm"
          style={{ width:"150px" }}
          onClick={()=>{
            JClickHandler("selectDepositMethodModal", clientData?.stages, dispatch, toggleCurrentModal)();
          }}
        >
          <img src="./img/wire-transfer.png" width={98} height={61}></img>
        </button>
      </div>
    </>
  );
}
export default withTranslation()(DepositTabs); 
