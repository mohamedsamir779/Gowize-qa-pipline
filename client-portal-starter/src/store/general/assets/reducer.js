import { FETCH_ASSETS_START, FETCH_ASSETS_SUCCESS } from "./actionTypes";

const initialState = {
  loading: false,
  error: "",
  assets: []
};

const assetsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ASSETS_START:
      return {
        ...state,
        loading: true,
      };
    case FETCH_ASSETS_SUCCESS:
      return {
        ...state,
        loading: false,
        assets: [...action.payload]
      };
    default:
      return { ...state };
  }
};
export default assetsReducer;