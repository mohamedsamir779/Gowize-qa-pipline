import {
  useEffect, useState, Fragment
} from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Tr, Td } from "react-super-responsive-table";
import useModal from "hooks/useModal";
import AllAccountsModal from "./AllAccountsModal";
import { startCase } from "lodash";

const RecursiveTableRows = ({ data, filter, level }) => {
  const { t } = useTranslation();
  const [accounts, setAccounts] = useState(data.childs);
  const [viewAccounts, toggleViewAccounts] = useModal();
  const [modalAccounts, setModalAccounts] = useState({});
  const [showNested, setShowNested] = useState({});
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
  }, [data.childs, filter]);

  return (
    <>
      {accounts ?
        accounts.map((parent) =>
          <Fragment key={parent._id}>        
            <Tr>
              <Td className="py-2 text-start">
                <div style={{ marginLeft: `${level * 15}px` }}>
                  {startCase(`${parent?.firstName} ${parent?.lastName}`)}
                  {parent.childs &&
              <Link to="#"
                className={`mdi mdi-chevron-${showNested[parent._id] ? "up" : "down"} ms-1`}
                onClick={() => toggleNested(parent._id)}
              ></Link>
                  }
                </div>
              </Td>
              <Td className="py-2 text-start">{data.firstName} {data.lastName}</Td>
              <Td className="py-2">{parent.fx.isIb ? t("Sub IB") : t("Client")}</Td>
              {/* acc num */}
              <Td className="py-2">
                { parent.fx.isIb ?  "-" : parent.fx.liveAcc.length > 0  ? 
                  <Link to="#" className="mdi mdi-eye font-size-18 py-0"
                    // eslint-disable-next-line react/jsx-indent-props
                    onClick={()=>{
                      setModalAccounts(parent.fx);
                      toggleViewAccounts();
                    }}
                  >
                  </Link>
                  : t("No Accounts")
                }
              </Td>
            </Tr>
            {showNested[parent._id] && parent.childs && <RecursiveTableRows data={parent} filter={filter} level={level + 1} />}
          </Fragment>
        )
        : <Tr><Td colSpan="4">{t("No referrals found.")}</Td></Tr>}
      <AllAccountsModal show={viewAccounts} toggle={toggleViewAccounts} accounts={modalAccounts} />
    </>
  );
};

export default RecursiveTableRows;