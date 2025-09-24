import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Tr, Td } from "react-super-responsive-table";
import AllAccountsModal from "./AllAccountsModal";

const RecursiveTableRows = ({ data, filter }) => {
  const { t } = useTranslation();

  const [viewAccounts, setViewAccounts] = useState(false);
  const toggleViewAccounts = () => setViewAccounts(!viewAccounts);
  const [accounts, setAccounts] = useState(data.childs);
  const [modalAccounts, setModalAccounts] = useState([]);

  const [showNested, setShowNested] = useState(false);
  const toggleNested = (name) => {
    setShowNested({
      ...showNested,
      [name]: !showNested[name]
    });
  };

  useEffect(() => {
    if (data.childs) {
      const accounts = data.childs;
      if (filter){
        setAccounts(accounts.filter(
          account => ((account.fx.agrementId == filter) || account.fx.agrementId === undefined)
        ));
      } else {
        setAccounts(accounts);
      }
    }
  }, [filter, data.childs]);

  return (accounts ?
    accounts.map((parent) =>
      <React.Fragment key={parent._id}>
        <Tr>
          <Td className="py-2">
            {parent.childs &&
              <Link to="#"
                className="mdi mdi-chevron-down me-2"
                onClick={() => toggleNested(parent._id)}
              ></Link>
            }
            {parent?.firstName} {parent?.lastName}
          </Td>
          <Td className="py-2">{parent.fx.isIb ? t("Sub IB") : t("Client")}</Td>
          {/* acc num */}
          <Td className="py-2">
            { parent.fx.isIb ?  "-" : parent.fx.liveAcc.length > 0  ? 
              <Link to="#" className="mdi mdi-eye font-size-18 py-0"
              // eslint-disable-next-line react/jsx-indent-props
                onClick={()=>{
                  setModalAccounts(parent.fx.liveAcc);
                  toggleViewAccounts();
                }}
              >
              </Link>
              : t("No Accounts")
            }
          </Td>
          <Td className="py-2">{data.firstName} {data.lastName}</Td>
        </Tr>
        {showNested[parent._id] && parent.childs && <RecursiveTableRows data={parent} filter={filter} />}
        <AllAccountsModal show={viewAccounts} toggle={toggleViewAccounts} accounts={modalAccounts} />
      </React.Fragment>
    )
    : <Tr><Td colSpan="4">{t("No referrals found.")}</Td></Tr>
  );
};

export default RecursiveTableRows;