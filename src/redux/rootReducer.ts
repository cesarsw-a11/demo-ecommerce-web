import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// slices
import nuDetectReducer from './slices/NuDetect';
import accountReducer from './slices/account';

// ----------------------------------------------------------------------

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: []
};

const accountPersistConfig = {
  key: 'account',
  storage,
  keyPrefix: 'redux-',
  whitelist: []
};

const rootReducer = combineReducers({
  nuDetectState: nuDetectReducer,
  accountState: persistReducer(accountPersistConfig, accountReducer)
});

export { rootPersistConfig, rootReducer };
