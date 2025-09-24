import debounce from "lodash/debounce";
import { checkUserEmailApi } from "apis/register";

const validateEmail = debounce(async (val, setFieldError) => {
  const res = await checkUserEmailApi({ payload: { email: val.toLocaleLowerCase() } });
  if (!res.result) setFieldError("email", "Email already exists");
}, 2000);

export default validateEmail;