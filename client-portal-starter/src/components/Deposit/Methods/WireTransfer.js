import { fetchCompanyBankAccounts } from "apis/bankAccounts";
import { AvField, AvForm } from "availity-reactstrap-validation";
import React, { useEffect, useState } from "react";
import { Label } from "reactstrap";
import CustomSelect from "components/Common/CustomSelect";

export default function WireTransfer(props) {
  const {
    t,
    setIsFirstStepValid
  } = props;
  const [banks, setBanks] = useState([]);
  const [bankAccount, setBankAccount] = useState(null);

  useEffect(async () => {
    if (banks.length === 0) {
      setBanks(await fetchCompanyBankAccounts());
    }
  }, []);

  useEffect(() => {
    if (bankAccount) {
      setIsFirstStepValid(true);
    } else {
      setIsFirstStepValid(false);
    }

  }, [bankAccount]);

  return (
    <div className="my-3">
      <CustomSelect
        name="bankAccount"
        onChange={(e) => setBankAccount(e.value)}
        required
        placeholder="Select Bank Account"
        options={banks?.map((bank) => {
          return {
            label:`${bank.bankName}`,
            value: bank
          };
        })}
      >
      </CustomSelect>
      {
        bankAccount && (
          <AvForm className="mt-4">
            <h5 className="mb-4">{t("Payment details")}</h5>
            <div>
              <Label>{t("Bank Holder Name")}</Label>
              <AvField
                type="text"
                name="accountHolderName"
                value={bankAccount.accountHolderName}
                validate={{ required:true }}
                disabled={true}
              >
              </AvField>
            </div>
            <div>
              <Label>{t("Bank Name")}</Label>
              <AvField
                type="text"
                name="bankName"
                value={bankAccount.bankName}
                validate={{ required:true }}
                disabled={true}
              >
              </AvField>
            </div>
            <div>
              <Label>{t("Account Number")}</Label>
              <AvField
                type="text"
                name="accountNumber"
                value={bankAccount.accountNumber}
                validate={{ required:true }}
                disabled={true}
              >
              </AvField>
            </div>
            <div>
              <Label>{t("Address")}</Label>
              <AvField
                type="text"
                name="address"
                value={bankAccount.address}
                validate={{ required:true }}
                disabled={true}
              >
              </AvField>
            </div>
            <div>
              <Label>{t("Swift Code")}</Label>
              <AvField
                type="text"
                name="swiftCode"
                value={bankAccount.swiftCode}
                validate={{ required:true }}
                disabled={true}
              >
              </AvField>
            </div>
            <div>
              <Label>{t("Currency")}</Label>
              <AvField
                type="text"
                name="currency"
                disabled={true}
                value={bankAccount.currency}
                validate={{ required:true }}
              >
              </AvField>
            </div>
            <p>{t("Bank Account")}</p>
            <p className="text-muted">
              {t("You MUST include the Reference Code in your deposit in order to credit your account!")}
            </p>
          </AvForm>
        )
      }
    </div>
  );
}
