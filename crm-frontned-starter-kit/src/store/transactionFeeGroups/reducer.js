const initalState = {
  loading: false,
  error: "",
  transactionFeeGroups: [],
  successMessage: ""
};
const transactionFeeGroupReducer = (state = initalState, action) => {
  switch (action.type) {
    case "FETCH_TRANSACTION_FEE_GROUPS_START":
      state = {
        ...state,
        loading: true,
        error: ""
      };
      break;
    case "FETCH_TRANSACTION_FEE_GROUPS_SUCCESS":
      state = {
        ...state,
        transactionFeeGroups: [...action.payload.result.docs],
        totalDocs: action.payload.result.totalDocs,
        hasNextPage: action.payload.result.hasNextPage,
        hasPrevPage: action.payload.result.hasPrevPage,
        limit: action.payload.result.limit,
        nextPage: action.payload.result.nextPage,
        page: action.payload.result.page,
        prevPage: action.payload.result.prevPage,
        totalPages: action.payload.result.totalPages,
        loading: false
      };

      break;
    case "ADD_TRANSACTION_FEES_GROUP_SUCCESS":
      state = {
        ...state,
        transactionFeeGroups: [{ ...action.payload }, ...state.transactionFeeGroups],
        totalDocs: state.totalDocs + 1,
        showAddSuccessMessage: true,
        addButtonDisabled: true
      };
      break;
    case "ADD_MODAL_CLEAR":
      state = {
        ...state,
        showAddSuccessMessage: false,
        addButtonDisabled: false
      };
      break;
    case "EDIT_TRANSACTION_FEE_GROUP_SUCCESS":
      state = {
        ...state,
        transactionFeeGroups: state.transactionFeeGroups.map(transactionFeeGroup => {
          if (transactionFeeGroup._id === action.payload._id) {
            let newDecimal = {};
            newDecimal = {
              ...action.payload,
              value: { $numberDecimal: action.payload?.value },
              minValue: { $numberDecimal: action.payload?.minValue },
              maxValue: { $numberDecimal: action.payload?.maxValue },
            };
            return {
              ...transactionFeeGroup,
              ...newDecimal
            };
          }
          else {
            return transactionFeeGroup;
          }
        }),
        showEditSuccessMessage: true,
        editButtonDisabled: true
      };
      break;
    case "EDIT_MODAL_CLEAR":
      state = {
        ...state,
        showEditSuccessMessage: false,
        editButtonDisabled: false
      };

      break;
    case "DELETE_TRANSACTION_FEE_GROUP_SUCCESS":

      state = {
        ...state,
        transactionFeeGroups: state.transactionFeeGroups.filter(transactionFeeGroup => transactionFeeGroup._id !== action.payload.id),
        totalDocs: state.totalDocs - 1,
        showDeleteModal: true,
        deleteLoading: true
      };

      break;
    case "DELETE_MODAL_CLEAR":
      state = {
        ...state,
        showDeleteModal: false,
        deleteLoading: false
      };
      break;
    case "API_ERROR":
      state = {
        ...state,
        error: action.payload.error
      };
      break;
    default:
      state = { ...state };
  }
  return state;
};
export default transactionFeeGroupReducer;