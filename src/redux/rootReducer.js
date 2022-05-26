import { combineReducers } from "redux";
import data from "./reducers/dataReducer";
import modal from "./reducers/modalReducer";

export const rootReducer = combineReducers({
	data,
	modal,
});
