import { debounce } from "lodash";
import {
  useCallback,
  useEffect,
  useState
} from "react";
import { useTranslation } from "react-i18next";
import AsyncAvFieldSelect from "./AsyncAvFieldSelect";

export default function SearchableComponent(props) {
  const { t } = useTranslation();
  const {
    placeholder = "Search",
    isRequired = false,
    name = "",
    label = "",
    defaultOptions = [],
    value = null,
    onChange = () => { },
    disallowed = null,
    getData = () => { },
    mapper = ( ) => {},
    shouldReset = false,
    raw = false,
  } = props;
  const [selectOptions, setSelectOptions] = useState(defaultOptions);

  useEffect(() => {
    const payload = {
      page: 1,
      limit: 10000,
    };
    getData(payload).then((data) => {
      setSelectOptions(data?.
        filter((client) => client._id !== disallowed)
        ?.map(client => mapper(client)));
    });
  }, [shouldReset]);

  const debouncedChangeHandler = useCallback(
    debounce((inputValue, cb) => {
      getData({
        searchText: inputValue,
        page: 1,
        limit: 10000,
      }).then((data) => {
        setSelectOptions(data?.map((client) => mapper(client)));
        return cb(data?.map((client) => mapper(client)));
      });
    }, 1000), []);

  return (
    <AsyncAvFieldSelect
      name={name}
      options={selectOptions}
      label={t(label)}
      errorMessage={t(`${label} is required`)}
      loadOptions={debouncedChangeHandler}
      defaultOptions={selectOptions || defaultOptions}
      value={value || ""}
      defaultValue={value || ""}
      isRequired={isRequired}
      placeholder={placeholder}
      isSearchable={true}
      backspaceRemovesValue={true}
      onChange={onChange}
    />
  );
}
