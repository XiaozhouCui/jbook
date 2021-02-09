import { combineReducers } from "redux";
import cellsReducer from "./cellsReducer";

const reducers = combineReducers({
  cells: cellsReducer,
});

export default reducers;

// export the return type of reducer type
export type RootState = ReturnType<typeof reducers>;
