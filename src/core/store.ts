import { createStore, combineReducers, Middleware, compose } from 'redux';
import { taskReducer, categoryReducer, settingReducer } from './modules';
import { IRootState } from './types';
import AsyncStorage from '@react-native-community/async-storage';
import { persistCombineReducers, persistStore, PersistConfig } from 'redux-persist';

const persistR = {
	task: taskReducer,
	category: categoryReducer,
	setting: settingReducer,
};
export const persistConfig: PersistConfig = {
	key: 'root',
	version: 1,
	storage: AsyncStorage,
	debug: __DEV__,
};

const persistReducer = persistCombineReducers(persistConfig, persistR as any);
const store = createStore(
	persistReducer,
	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
const persistor = persistStore(store);
export { store, persistor };