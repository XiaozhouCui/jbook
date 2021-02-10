import React from "react";
import { useActions } from "../hooks/use-actions";

interface ActionBarProps {
  id: string;
}

const ActionBar: React.FC<ActionBarProps> = ({ id }) => {
  // useActions include action creators and useDispatch
  const { moveCell, deleteCell } = useActions();
  return (
    <div>
      <button onClick={() => moveCell(id, 'up')}>Up</button>
      <button onClick={() => moveCell(id, 'down')}>Down</button>
      <button onClick={() => deleteCell(id)}>Delete</button>
    </div>
  );
};

export default ActionBar;
