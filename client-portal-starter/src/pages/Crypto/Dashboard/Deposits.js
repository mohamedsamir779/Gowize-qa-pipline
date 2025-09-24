import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import CustomTable from "../../../components/Common/CustomTable";
import {
  Button, Container
} from "reactstrap";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

import { fetchClientDeposits } from "../../../store/crypto/transactions/deposit/actions";
//i18n
import { withTranslation } from "react-i18next";

const Deposit = (props) => {
  const dispatch = useDispatch();
  const [limit, setLimit] = useState(3);

  const loadDeposits = () => {
    dispatch(fetchClientDeposits({
      page: 1,
      limit
    }));
  };
  
  useEffect(() => {
    loadDeposits();
  }, [limit]);

  return (
    <React.Fragment>
      <Container>
        <div className='pt-2'>
          {
            props.deposits 
              &&
              <>
                <CustomTable 
                  rows={props.deposits && props.deposits} 
                  columns={props.columns}
                  loading={props.loading}
                />
                <Button 
                  disabled={limit >= props.totalDeposits}
                  type="button" 
                  className='blue-gradient-color w-100'
                  onClick={() => {
                    props.totalWithdrawals > props.withdrawals?.length && setLimit(limit + 5);
                  }}
                >
                  {props.t("Load more")}
                </Button>
              </>
          }
        </div>
      </Container>
    </React.Fragment >
  );
};

const mapStateToProps = (state) => ({
  deposits: state.crypto.depositsReducer.deposits,
  totalDeposits: state.crypto.depositsReducer.totalDocs,
  loading: state.crypto.depositsReducer.loading,
});
export default connect(mapStateToProps, null)(withTranslation()(Deposit)); 