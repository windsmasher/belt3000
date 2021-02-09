import { combineReducers } from 'redux';
import { competitorReducer } from './competitor-reducer';
import { authReducer } from './auth-reducer';
import { nominationReducer } from './nomination-reducer';

const rootReducer = combineReducers({
  competitors: competitorReducer,
  authData: authReducer,
  nominations: nominationReducer,
});

export default rootReducer;
