import ReactDOM from "react-dom";
import { useState } from "react";
import "bulmaswatch/superhero/bulmaswatch.min.css";
import CodeEditor from "./components/code-editor";
import Preview from "./components/preview";
import bundle from "./bundler";

const App = () => {
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

ReactDOM.render(<App />, document.querySelector("#root"));
