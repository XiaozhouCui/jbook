import produce from "immer";
import { Cell } from "../cell";
import { Action } from "../actions";
import { ActionType } from "../action-types";

interface CellsState {
  loading: boolean;
  error: string | null;
  order: string[]; // array of ID
  data: {
    [key: string]: Cell;
  };
}

const intro = `
# JBook
This is an interactive coding environment. You can write JavaScript, see it executed, and write comprehensive documentation using markdown.
- Click any text cell (including this one) to edit it
- The code in each code editor is all joined together into one file. If you define a variable in cell #1, you can refer to it in any following cell.
- You can show any React component, string, number, or anything else by calling the \`show()\` function. This is a function built into this environment. Call show multiple times to show multiple values
- Re-order or delete cells using the buttons on the top right
- Add new cells by howvering on the divider between each cell
`

const sample1 = 
`import { useState } from 'react';

const Counter = () => {
  const [count, setCount] = useState(0);
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Click</button>
      <h3>Count: {count}</h3>
    </div>
  );
};
// Display any variable or React Component by calling "show()"
show(<Counter />);`

const sample2 = 
`const App = () => {
  return (
    <div>
      <h3>App Says Hi!</h3>
      <i>Counter component will be rendered below...</i>
      <hr />
      {/* Counter declared in the previous cell can be referenced here */}
      <Counter />
    </div>
  );
};

show(<App />);`

const initialState: CellsState = {
  loading: false,
  error: null,
  order: ["introduction", "example1", "example2"],
  data: {
    introduction: {
      id: "introduction",
      type: "text",
      content: intro,
    },
    example1: {
      id: "example1",
      type: "code",
      content: sample1,
    },
    example2: {
      id: "example2",
      type: "code",
      content: sample2,
    },
  },
};

const reducer = produce((state: CellsState = initialState, action: Action) => {
  switch (action.type) {
    case ActionType.UPDATE_CELL:
      const { id, content } = action.payload;
      // Thanks to "immer" produce(), no need to return a cloned object
      state.data[id].content = content;
      // return the MUTATED state, immer will handle it
      return state;

    // return {
    //   ...state,
    //   data: { ...state.data, [id]: { ...state.data[id], content } },
    // };
    case ActionType.DELETE_CELL:
      delete state.data[action.payload];
      state.order = state.order.filter((id) => id !== action.payload);
      return state;
    case ActionType.MOVE_CELL:
      const { direction } = action.payload;
      const index = state.order.findIndex((id) => id === action.payload.id);
      const targetIndex = direction === "up" ? index - 1 : index + 1;

      // handle first and last item in array
      if (targetIndex < 0 || targetIndex > state.order.length - 1) return state;

      // swap the position of adjacent items in state.order array
      state.order[index] = state.order[targetIndex];
      state.order[targetIndex] = action.payload.id;
      return state;
    case ActionType.INSERT_CELL_AFTER:
      const cell: Cell = {
        content: "",
        type: action.payload.type,
        id: randomId(), // a random id is generated
      };

      // add new cell to state.data
      state.data[cell.id] = cell;

      // add new cell ID into state.order array
      const foundIndex = state.order.findIndex(
        (id) => id === action.payload.id
      );
      if (foundIndex < 0) {
        // if no ID in payload, meaning the cell will be added in the very top
        state.order.unshift(cell.id);
      } else {
        state.order.splice(foundIndex + 1, 0, cell.id);
      }

      return state;
    default:
      return state;
  }
});

const randomId = () => {
  return Math.random().toString(36).substr(2, 5);
};

export default reducer;
