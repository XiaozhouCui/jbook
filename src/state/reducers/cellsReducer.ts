import produce from "immer";
import { Cell } from "../cell";
import { Action } from "../actions";
import { ActionType } from "../action-types";

interface CellsState {
  loading: boolean;
  error: string | null;
  order: string[];
  data: {
    [key: string]: Cell;
  };
}

const initialState: CellsState = {
  loading: false,
  error: null,
  order: [],
  data: {},
};

const reducer = produce(
  (state: CellsState = initialState, action: Action): CellsState | void => {
    switch (action.type) {
      case ActionType.UPDATE_CELL:
        const { id, content } = action.payload;
        // Thanks to "immer" produce(), no need to return a cloned object
        state.data[id].content = content;
        return;

        // return {
        //   ...state,
        //   data: { ...state.data, [id]: { ...state.data[id], content } },
        // };
      case ActionType.DELETE_CELL:
        delete state.data[action.payload];
        state.order = state.order.filter((id) => id !== action.payload);
        return;
      case ActionType.MOVE_CELL:
        return state;
      case ActionType.INCERT_CELL_BEFORE:
        return state;
      default:
        return state;
    }
  }
);

export default reducer;
