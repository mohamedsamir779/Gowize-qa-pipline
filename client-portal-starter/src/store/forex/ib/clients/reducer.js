import {
  GET_IB_CLIENTS_START, GET_IB_CLIENTS_SUCCESS, 
  GET_IB_CLIENT_ACCOUNTS_START, GET_IB_CLIENT_ACCOUNTS_SUCCESS,
  GET_IB_CLIENT_ACCOUNT_ACTIVITIES_START,
  GET_IB_CLIENT_ACCOUNT_ACTIVITIES_SUCCESS,

  GET_CLIENT_IB_ACCOUNTS_START,
  GET_CLIENT_IB_ACCOUNTS_SUCCESS,
  GET_CLIENT_IB_ACCOUNTS_FAILURE,

  GET_ALL_CLIENTS_IB_ACCOUNTS_START,
  GET_ALL_CLIENTS_IB_ACCOUNTS_SUCCESS,
  GET_ALL_CLIENTS_IB_ACCOUNTS_FAILURE,
} from "./actionTypes";

const initialState = {
  clients: [],
  loading: false,
  clientAccounts:[],
  clientAccountsLoading:false,
  clientAccountActivity:{
    docs:[],
    loading:false
  },

};
const ibClients = (state = initialState, action)=>{
  switch (action.type) {
    case GET_IB_CLIENTS_START:
      return {
        ...state,
        loading:true,
      };
    case GET_IB_CLIENTS_SUCCESS:
      return {
        ...state,
        loading:false,
        clients:action.payload ? action.payload[0].childs : []
      };    
    case GET_IB_CLIENT_ACCOUNTS_START:
      return {
        ...state,
        clientAccountsLoading:true,
        clientAccounts:[]
      };
    case GET_IB_CLIENT_ACCOUNTS_SUCCESS:
      return {
        ...state,
        clientAccountsLoading: false,
        clientAccounts:action.payload.docs,
      };
    case GET_IB_CLIENT_ACCOUNT_ACTIVITIES_START:
      return {
        ...state,
        clientAccountActivity: {
          docs:[],
          loading: true
        },
      };
    case GET_IB_CLIENT_ACCOUNT_ACTIVITIES_SUCCESS:
      return {
        ...state,
        clientAccountActivity:{
          ...action.payload,
          loading: false
        }
      };
    
    // get ib client accounts (owned by the client ibMT4 + ibMT5)
    case GET_CLIENT_IB_ACCOUNTS_START:
      return {
        ...state,
      };
    case GET_CLIENT_IB_ACCOUNTS_SUCCESS:
      return {
        ...state,
        ibClientAccounts: action.payload.result
      };
    case GET_CLIENT_IB_ACCOUNTS_FAILURE:
      return {
        ...state,
        ibClientAccountsError: action.payload.error
      };

    // get all clients accounts
    case GET_ALL_CLIENTS_IB_ACCOUNTS_START:
      return {
        ...state,
        allIbClientsLoading: true
      };
    case GET_ALL_CLIENTS_IB_ACCOUNTS_SUCCESS:
      return {
        ...state,
        allIbClientsAccounts: action.payload.result,
        allIbClientsLoading: false
      };
    case GET_ALL_CLIENTS_IB_ACCOUNTS_FAILURE:
      return {
        ...state,
        allIbClientsAccountsError: action.payload.error,
        allIbClientsLoading: false
      };
    
    default:
      return state;
  }
};
export default ibClients;