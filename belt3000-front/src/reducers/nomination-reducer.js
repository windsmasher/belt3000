export const nominationReducer = (state = [], action) => {
  switch (action.type) {
    case 'GET_ALL_NOMINATIONS':
      return [...action.payload];
    case 'GET_NOMINATIONS_BY_COMPETITOR':
      return [...action.payload];
    case 'ADD_NOMINATION':
      return [...state, action.payload];
    case 'DELETE_LAST_NOMINATION':
      return [...state.filter(item => item.id !== action.payload)];
    case 'UPDATE_DESCRIPTION':
      return [...state.map(item => (item.id === action.payload.id ? action.payload : item))];
    default:
      return state;
  }
};
