import React, { useEffect, useContext } from "react";
import { connect, useDispatch } from "react-redux";
import {
  fetchMarkets, 
  fetchOrderBooks, 
  fetchProfile, 
  fetchHighKlines, 
  fetchAssets, 
  fetchDictStart, 
  fetchLogs,
  fetchBankAccounts,
} from "../../store/actions";
import SocketContext from "../../context/context";
import { useHistory } from "react-router-dom";
import { enableCrypto } from "config";


const PortalEntryPoint = props => {
  const history = useHistory();
  const dispatch = useDispatch();
  const {
    setState,
  } = useContext(SocketContext);
  useEffect(() => {
    dispatch(fetchProfile({ history }));
    dispatch(fetchDictStart());
    if (enableCrypto) {
      dispatch(fetchMarkets());
      dispatch(fetchOrderBooks());
      dispatch(fetchHighKlines());
    }
    dispatch(fetchAssets());
    dispatch(fetchLogs({
      limit: 10,
      page: 1
    }));
    dispatch(fetchBankAccounts());
  }, []);

  useEffect(() => {
    setState(state => {
      return {
        ...state,
        markupId: props.profile?.markupId?._id,
      };
    });
  }, [props.profile]);

  return <></>;
};

const mapStateToProps = (state) => ({
  profile: state.Profile.clientData,
});
export default connect(mapStateToProps, null)(PortalEntryPoint);