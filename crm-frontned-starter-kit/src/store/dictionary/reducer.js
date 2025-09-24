/* eslint-disable no-case-declarations */
const initialState = {
  dictionary: [],
  loading: false,
  actions: [],
  exchanges: [],
  countries: [],
  markups: [],
  products: {
    forex: [],
    crypto: [],
    stocks: [],
    commodities: [],
    indices: [],
    bullion: [],
    metals: [],
    energy: [],
    futureEnergy: [],
    futureIndices: [],
  },
  callStatus: [],
  defaultCallStatusColors: {},
  error: "",
  id: ""
};
const dictionaryReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_DICTIONARY_START":
      state = {
        ...state,
        loading: true,
        error: ""
      };
      break;
    case "FETCH_DICTIONARY_SUCCESS":
      const {
        actions = [],
        emailProviders = [],
        countries = [],
        exchanges = [],
        markups = [],
        products = {},
        callStatus = {},
        defaultCallStatusColors = {},
      } = action.payload[0] || {};
      state = {
        ...state,
        dictionary: [...action.payload],
        actions: [...actions],
        emailProviders: [...emailProviders],
        countries: [...countries],
        exchanges: [...exchanges],
        markups: [...markups],
        products: { ...products },
        id: action.payload[0]._id,
        callStatus: callStatus && callStatus.length > 0 ? Object.assign({}, ...callStatus.map(key => ({ [key]: key }))) : {},
        defaultCallStatusColors: { ...defaultCallStatusColors },
        loading: false,
      };
      break;
    case "FETCH_DICTIONARY_FAILED":
      state = {
        ...state,
        loading: false,
        error: action.payload.error
      };
      break;
    case "ADD_NEW_ITEM":
      state = {
        ...state,
        disableAddButton: true
      };
      break;
    case "ADD_ITEM_TO_ACTIONS":
      state = {
        ...state,
        showAddSuccessMessage: true,
        actions: [...state.actions, ...action.payload],
      };
      break;
    case "ADD_ITEM_TO_MARKUPS":
      state = {
        ...state,
        showAddSuccessMessage: true,
        markups: [...state.markups, ...action.payload],
      };
      break;
    case "ADD_ITEM_TO_EXCHANGES":
      state = {
        ...state,
        showAddSuccessMessage: true,
        exchanges: [...state.exchanges, ...action.payload],
        disableAddButton: true
      };
      break;
    case "ADD_ITEM_TO_CALL_STATUS":
      action.payload[0] = action.payload[0].toUpperCase();
      state = {
        ...state,
        showAddSuccessMessage: true,
        callStatus: Object.assign({}, state.callStatus, { [action.payload[0]]: action.payload[0] }),
        defaultCallStatusColors: Object.assign({}, state.defaultCallStatusColors, { [action.payload[0]]: action.payload[1] }),
      };
      break;
    case "ADD_ITEM_TO_COUNTRIES":
      state = {
        ...state,
        showAddSuccessMessage: true,
        countries: [...action.payload, ...state.countries],
      };
      break;
    case "REMOVE_ITEM":
      state = {
        ...state,
        disableDeleteButton: true
      };
      break;
    case "REMOVE_ITEM_FROM_ACTIONS":
      state = {
        ...state,
        clearDeleteModal: false,
        actions: state.actions.filter(actions => actions !== action.payload[0])
      };
      break;
    case "REMOVE_ITEM_FROM_MARKUP":
      state = {
        ...state,
        clearDeleteModal: false,
        markups: state.markups.filter(markups => markups !== action.payload[0])
      };
      break;
    case "REMOVE_ITEM_FROM_EXCHANGES":
      state = {
        ...state,
        clearDeleteModal: false,
        exchanges: state.exchanges.filter(exchange => exchange !== action.payload[0])
      };
      break;
    case "REMOVE_ITEM_FROM_COUNTRIES":
      state = {
        ...state,
        clearDeleteModal: false,
        countries: state.countries.filter(country => country._id !== action.payload[0]._id)
      };
      break;
    case "UPDATE_ACTION_START":
      state = {
        ...state,
        disableEditButton: true
      };
      break;
    case "UPDATE_MARKUP_START":
      state = {
        ...state,
        disableEditButton: true
      };
      break;
    case "UPDATE_EXCHANGE_START":
      state = {
        ...state,
        disableEditButton: true
      };
      break;
    case "UPDATE_CALL_STATUS_START":
      state = {
        ...state,
        disableEditButton: true
      };
      break;
    case "UPDATE_COUNTRY_START":
      state = {
        ...state,
        disableEditButton: true
      };
      break;
    case "UPDATE_ACTION_SUCCESS":
      state = {
        ...state,
        editSuccess: true,
        actions: state.actions.map(actionValue => {
          if (actionValue === action.payload.oldValue) {
            return action.payload.newValue;
          }
          else {
            return actionValue;
          }
        })
      };
      break;
    case "UPDATE_MARKUP_SUCCESS":
      state = {
        ...state,
        editSuccess: true,
        markups: state.markups.map(markupValue => {
          if (markupValue === action.payload.oldValue) {
            return action.payload.newValue;
          }
          else {
            return markupValue;
          }
        })
      };
      break;
    case "UPDATE_EXCHANGE_SUCCESS":
      state = {
        ...state,
        editSuccess: true,
        exchanges: state.exchanges.map(exchange => {
          if (exchange === action.payload.oldValue) {
            return action.payload.newValue;
          }
          else {
            return exchange;
          }
        })
      };
      break;
    case "UPDATE_CALL_STATUS_SUCCESS":
      state = {
        ...state,
        editSuccess: true,
      };
      break;
    case "UPDATE_COUNTRY_SUCCESS":
      state = {
        ...state,
        editSuccess: true,
        countries: state.countries.map(country => {
          if (country._id === action.payload.countryId) {
            return {
              ...country,
              ...action.payload.newValue
            };
          }
          else {
            return country;
          }
        })
      };
      break;
    case "UPDATE_PRODUCTS_START":
      state = {
        ...state,
        disableEditButton: true,
        products: state.products,
        editSuccess: false
      };
      break;
    case "UPDATE_PRODUCTS_SUCCESS":
      state = {
        ...state,
        disableEditButton: false,
        products: action?.payload?.newProducts || state.products,
        editSuccess: true
      };
      break;
    case "UPDATE_PRODUCTS_FAILED":
      state = {
        ...state,
        disableEditButton: false,
        products: state.products,
        editSuccess: false
      };
      break;
    case "EDIT_CLEAR":
      state = {
        ...state,
        editSuccess: false,
        disableEditButton: false
      };
      break;
    case "ADD_CLEAR":
      state = {
        ...state,
        showAddSuccessMessage: false,
        disableAddButton: false
      };
      break;
    case "CLEAR_DELETE_MODAL":
      state = {
        ...state,
        clearDeleteModal: true,
        disableDeleteButton: false
      };
      break;
    case "API_ERROR":
      state = {
        ...state,
        error: action.payload.error,
        disableAddButton: false,
      };
      break;
    default:
      state = { ...state };
  }
  return state;
};
export default dictionaryReducer;