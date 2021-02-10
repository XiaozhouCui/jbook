import { useEffect, useState } from "react";
import CodeEditor from "./code-editor";
import Preview from "./preview";
import bundle from "../bundler";
import Resizable from "./resizable";
import { Cell } from "../state";
import { useActions } from "../hooks/use-actions";

interface CodeCellProps {
  cell: Cell;
}

// A CodeCell has 1 code editor (monaco) and 1 preview window (iframe)
const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const [err, setErr] = useState("");
  const [code, setCode] = useState("");

  const { updateCell } = useActions();

  // Debouncing: only run bundler after user STOPPED typing for 1 second
  useEffect(() => {
    const timer = setTimeout(async () => {
      // bundle the raw input code with esbuild
      const output = await bundle(cell.content);
      // store bundled code to state, to be passed down to "Preview" component as props
      setCode(output.code);
      setErr(output.err);
    }, 1000);

    // clear timer when user keep typing
    return () => {
      clearTimeout(timer);
    };
  }, [cell.content]);

  return (
    <Resizable direction="vertical">
      <div style={{ height: "calc(100% - 10px)", display: "flex", flexDirection: "row" }}>
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue={cell.content}
            onChange={(value) => updateCell(cell.id, value)}
          />
        </Resizable>
        {/* Preview is an iframe */}
        <Preview code={code} err={err} />
      </div>
    </Resizable>
  );
};

export default CodeCell;
