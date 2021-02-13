import { useEffect } from "react";
import CodeEditor from "./code-editor";
import Preview from "./preview";
import Resizable from "./resizable";
import { Cell } from "../state";
import { useActions } from "../hooks/use-actions";
import { useTypedSelector } from "../hooks/use-typed-selector";
import "./code-cell.css";

interface CodeCellProps {
  cell: Cell;
}

// A CodeCell has 1 code editor (monaco) and 1 preview window (iframe)
const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const { updateCell, createBundle } = useActions();
  const bundle = useTypedSelector((state) => state.bundles[cell.id]);

  // join codes in all cells to be bundled together
  const cumulativeCode = useTypedSelector((state) => {
    const { data, order } = state.cells;
    const orderedCells = order.map((id) => data[id]);
    // prepare a show() function for all code cells
    const showFunc = `
      import _React from 'react';
      import _ReactDOM from 'react-dom';
      var show = (value) => {
        const root = document.querySelector('#root');

        if (typeof value === 'object') {
          if (value.$$typeof && value.props) {
            _ReactDOM.render(value, root)
          } else {
            root.innerHTML = JSON.stringify(value);
          }
        } else {
          root.innerHTML = value
        }
      }
    `;
    const showFuncNoOp = "var show = () => {}";
    const cumulativeCodeArray = [];
    for (let c of orderedCells) {
      if (c.type === "code") {
        if (c.id === cell.id) {
          // only add showFunc for current cell
          cumulativeCodeArray.push(showFunc)
        } else {
          // for previous cell inputs, don't display result in current preview iframe
          cumulativeCodeArray.push(showFuncNoOp)
        }
        cumulativeCodeArray.push(c.content);
      }
      if (c.id === cell.id) {
        break;
      }
    }
    return cumulativeCodeArray;
  });

  // Debouncing: only run bundler after user STOPPED typing for 1 second
  useEffect(() => {
    // create an initial bundle and stop
    if (!bundle) {
      createBundle(cell.id, cumulativeCode.join("\n"));
      return;
    }
    const timer = setTimeout(async () => {
      // async bundle the raw input code with esbuild, 1 second after typing stopped
      createBundle(cell.id, cumulativeCode.join("\n"));
      // bundled code will be saved in store.bundles, and passed down to "Preview" component as props
    }, 1000);

    // clear timer when user keep typing
    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cumulativeCode.join("\n"), cell.id, createBundle]);

  return (
    <Resizable direction="vertical">
      <div
        style={{
          height: "calc(100% - 10px)",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue={cell.content}
            onChange={(value) => updateCell(cell.id, value)}
          />
        </Resizable>
        <div className="progress-wrapper">
          {!bundle || bundle.loading ? (
            <div className="progress-cover">
              <progress className="progress is-small is-primary" max="100">
                Loading
              </progress>
            </div>
          ) : (
            <Preview code={bundle.code} err={bundle.err} />
          )}
        </div>
      </div>
    </Resizable>
  );
};

export default CodeCell;
