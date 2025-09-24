import { fetchCompanyBankAccounts } from "apis/bankAccounts";
import { AvField, AvForm } from "availity-reactstrap-validation";
import Select from "react-select";
import React, { useEffect, useState } from "react";
import { Label } from "reactstrap";

export default function A3tmad(props) {
  const {
    t,
    setIsFirstStepValid
  } = props;
  
  const [a3tmadBox, setA3tmadBox] = useState("حواله بنكيه");
  // const a3tmadList = [
  //   "اندلس 1126 السلام",
  //   "الراوي 735 السلام ترمانين",
  //   "اللورد 720 السلام ترمانين",
  //   "سبايدر 113 ترمانين",
  //   "اليقين 199 السلام ترمانين",
  //   "البركات 409 السلام ترمانين"
  // ];
  const a3tmadList = [
    "حواله بنكيه"
  ];

  useEffect(() => {
    if (a3tmadBox) {
      setIsFirstStepValid(true);
    }
  }, [a3tmadBox]);

  // useEffect(() => {
  //   setIsFirstStepValid(true);
    
  // }, []);

  return (
    <div className="my-3">
      {/* <Select
        name="a3tmadBox"
        onChange={(e) => setA3tmadBox(e.value)}
        required
        placeholder="حواله بنكيه"
        options={a3tmadList.map((a3tmad) => {
          return {
            label: a3tmad,
            value: a3tmad
          };
        })}
      >
      </Select> */}
      {
        // a3tmadBox && (
        //   <AvForm className="mt-5">
        //     <h5 className="mb-4">{t("Payment details")}</h5>
        //     <div>
        //       <Label>{t("حواله بنكيه")}</Label>
        //       <AvField
        //         type="text"
        //         name="a3tmadBox"
        //         value={a3tmadList[0]}
        //         validate={{ required:true }}
        //         disabled={true}
        //       >
        //       </AvField>
        //     </div>
        //   </AvForm>
        // )
      }
    </div>
  );
}
