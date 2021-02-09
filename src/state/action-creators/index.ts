import { CellTypes } from "./../cell";
import { ActionType } from "../action-types";
import {
  UpdateCellAction,
  MoveCellAction,
  DeleteCellAction,
  InsertCellBeforeAction,
} from "./../actions/index";

export const updateCell = (id: string, content: string): UpdateCellAction => {
  return {
    type: ActionType.UPDATE_CELL,
    payload: { id, content },
  };
};

export const deleteCell = (id: string): DeleteCellAction => {
  return {
    type: ActionType.DELETE_CELL,
    payload: id,
  };
};

export const moveCell = (
  id: string,
  direction: "up" | "down"
): MoveCellAction => {
  return {
    type: ActionType.MOVE_CELL,
    payload: { id, direction },
  };
};

export const insertCellBefore = (
  id: string,
  cellType: CellTypes
): InsertCellBeforeAction => {
  return {
    type: ActionType.INCERT_CELL_BEFORE,
    payload: { id, type: cellType },
  };
};