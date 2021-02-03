export const competitorReducer = (state = [], action) => {
  switch (action.type) {
    case 'GET_ALL_COMPETITORS':
      return [...action.payload];
    case 'DELETE_COMPETITOR':
      return [...state.filter(item => item.id !== action.payload)];
    case 'ADD_COMPETITOR':
      return [...state, action.payload];
    case 'UPDATE_COMPETITOR':
      return [...state.map(item => (item.id === action.payload.id ? action.payload : item))];
    default:
      return state;
  }
};
