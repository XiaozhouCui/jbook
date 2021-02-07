import { useState } from "react";
import CodeEditor from "./code-editor";
import Preview from "./preview";
import bundle from "../bundler";

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
    <div>
      <CodeEditor
        initialValue="const a = 1;"
        onChange={(value) => setInput(value)}
      />
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      {/* Preview is an iframe */}
      <Preview code={code} />
    </div>
  );
};

export default CodeCell;
