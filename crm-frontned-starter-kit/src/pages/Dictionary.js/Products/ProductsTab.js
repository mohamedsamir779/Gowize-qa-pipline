import React, {
  useEffect,
  useReducer,
} from "react";
import { connect, useDispatch } from "react-redux";
import {
  Button,
  Card, CardBody, CardHeader
} from "reactstrap";

import { withTranslation } from "react-i18next";
import CustomCreatableSelect from "components/Common/CustomCreatableSelect";
import { startCase } from "lodash";
import { updateProductsStart } from "store/dictionary/actions";

const ProductsTab = (props) => {
  const dispatch = useDispatch();
  const {
    dictionary,
    products = {

    },
    t,
  } = props;

  const [state, dispatchState] = useReducer((state, action) => {
    switch (action.type) {
      case "forex":
        return {
          ...state,
          forex: action.forex,
        };
      case "crypto":
        return {
          ...state,
          crypto: action.crypto,
        };
      case "stocks":
        return {
          ...state,
          stocks: action.stocks,
        };
      case "commodities":
        return {
          ...state,
          commodities: action.commodities,
        };
      case "bullion":
        return {
          ...state,
          bullion: action.bullion,
        };
      case "indices":
        return {
          ...state,
          indices: action.indices,
        };
      case "metals":
        return {
          ...state,
          metals: action.metals,
        };
      case "energy":
        return {
          ...state,
          energy: action.energy,
        };
      case "futureEnergy":
        return {
          ...state,
          futureEnergy: action.futureEnergy,
        };
      case "futureIndices":
        return {
          ...state,
          futureIndices: action.futureIndices,
        };
      case "init":
        return {
          ...state,
          ...action.products,
        };
      default:
        return state;
    }
  }, products);

  const handleUpdateButton = (e) => {
    e.preventDefault();
    dispatch(
      updateProductsStart(state)
    );
  };

  useEffect(() => {
    dispatchState({
      type: "init",
      products,
    });
  }, [products]);

  const { update, delete: deletePermission } = props.dictionariesPermissions;

  return (
    <React.Fragment>
      <Card>
        <CardHeader>
          <div className="d-flex justify-content-end  align-items-center ">
            <Button
              color="primary"
              className={`d-flex justify-content-end  align-items-center btn btn-primary ${!update ? "d-none" : ""}`}
              onClick={handleUpdateButton}
            >
              {props.t("Update Products")}
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <div className="mt-4">
            {
              dictionary[0] && products &&
              Object.keys(products).map((key, index) => {
                return (
                  <div
                    className="mb-4"
                    key={index}>
                    <h5>{`${startCase(key)} Products`}</h5>
                    <CustomCreatableSelect
                      isMulti
                      isClearable
                      disableDeleteButton={!deletePermission}
                      disableCreateButton={!update}
                      placeholder={t("Please enter product symbol exactly as it appears")}
                      dispatchState={(passedData) => dispatchState({
                        type: key,
                        [key]: passedData,
                      })}
                      value={state[key].map((item) => {
                        return {
                          value: item,
                          label: item,
                        };
                      })}
                    />
                  </div>
                );
              })
            }
            <Button
              color="primary"
              className={`d-flex justify-content-end  align-items-center btn btn-primary ${!update ? "d-none" : ""}`}
              onClick={handleUpdateButton}
            >
              {props.t("Update Products")}
            </Button>
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  loading: state.dictionaryReducer.loading || false,
  dictionary: state.dictionaryReducer.dictionary || [],
  error: state.dictionaryReducer.error,
  products: state.dictionaryReducer.products || [],
  id: state.dictionaryReducer.id,
  deleteLoading: state.dictionaryReducer.deleteLoading,
  editSuccess: state.dictionaryReducer.editSuccess,
  clearDeleteModal: state.dictionaryReducer.clearDeleteModal,
  dictionariesPermissions: state.Profile.dictionariesPermissions || {},
  disableDeleteButton: state.dictionaryReducer.disableDeleteButton
});

export default connect(mapStateToProps, null)(withTranslation()(ProductsTab));
