export const competitorReducer = (state = [], action) => {
  switch (action.type) {
    case 'GET_ALL_COMPETITORS':
      return [...action.payload];
    default:
      return state;
  }
};
