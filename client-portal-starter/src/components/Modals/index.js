import CryptoModals from "./Crypto";
import DepositsModal from "./Deposits/DepositModals";
import ForexModals from "./Forex/Forex";
import JourneyModals from "./JourneyModals";
import WalletModals from "./Wallets/Wallet";
import WithdrawModals from "./Withdrawals/WithdrawModals";

const Modals = () => {
  return (
    <>
      <CryptoModals />
      <ForexModals />
      <JourneyModals />
      <WalletModals />
      <DepositsModal />
      <WithdrawModals />
    </>
  );
};

export default Modals;