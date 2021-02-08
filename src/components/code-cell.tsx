import { useEffect, useState } from "react";
import CodeEditor from "./code-editor";
import Preview from "./preview";
import bundle from "../bundler";
import Resizable from "./resizable";

// A CodeCell has 1 code editor (monaco) and 1 preview window (iframe)
const CodeCell = () => {
  const [input, setInput] = useState("");
  const [err, setErr] = useState("");
  const [code, setCode] = useState("");

  // Debouncing: only run bundler after user STOPPED typing for 1 second
  useEffect(() => {
    const timer = setTimeout(async () => {
      // bundle the raw input code with esbuild
      const output = await bundle(input);
      // store bundled code to state, to be passed down to "Preview" component as props
      setCode(output.code);
      setErr(output.err);
    }, 1000);

    // clear timer when user keep typing
    return () => {
      clearTimeout(timer);
    };
  }, [input]);

  return (
    <Resizable direction="vertical">
      <div style={{ height: "100%", display: "flex", flexDirection: "row" }}>
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue="const a = 1;"
            onChange={(value) => setInput(value)}
          />
        </Resizable>
        {/* Preview is an iframe */}
        <Preview code={code} err={err} />
      </div>
    </Resizable>
  );
};

export default CodeCell;
