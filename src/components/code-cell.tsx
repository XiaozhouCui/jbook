import { useState } from "react";
import CodeEditor from "./code-editor";
import Preview from "./preview";
import bundle from "../bundler";
import Resizable from "./resizable";

// A CodeCell has 1 code editor (monaco) and 1 preview window (iframe)
const CodeCell = () => {
  const [input, setInput] = useState("");
  const [code, setCode] = useState("");

  const onClick = async () => {
    // bundle the raw input code with esbuild
    const output = await bundle(input);

    // store bundled code to state, to be passed down to "Preview" component as props
    setCode(output);
  };

  return (
    <Resizable direction="vertical">
      <div style={{ height: "100%", display: "flex", flexDirection: "row" }}>
        <CodeEditor
          initialValue="const a = 1;"
          onChange={(value) => setInput(value)}
        />
        {/* Preview is an iframe */}
        <Preview code={code} />
      </div>
    </Resizable>
  );
};

export default CodeCell;
