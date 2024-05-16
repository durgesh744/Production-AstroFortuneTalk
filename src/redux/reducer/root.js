import {combineReducers} from 'redux';
import {CLEAN_STORE} from '../actionTypes/ProviderActionTypes';
import provider from './provider';
import liveClass from './liveClass';
import chat from './chat';

const rootReducer = combineReducers({
  provider,
  liveClass,
  chat
});

const appReducer = (state, action) => {
  if (action.type == CLEAN_STORE) {
    state = undefined;
  }
  return rootReducer(state, action);
};

export default appReducer;
