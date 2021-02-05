import * as esbuild from "esbuild-wasm";
import { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";

// copy esbuild.wasm from node_modules to public folder

const App = () => {
  const ref = useRef<any>();
  const [input, setInput] = useState("");
  const [code, setCode] = useState("");

  const startService = async () => {
    // assign the esbuild service to ref.current (useRef)
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: "/esbuild.wasm", // web assembly binary in public/ folder
    });
  };

  useEffect(() => {
    startService();
  }, []);

  const onClick = async () => {
    if (!ref.current) return;
    // transpile the input code (async)
    const result = await ref.current.transform(input, {
      loader: "jsx",
      target: "es2015",
    });
    // save the transpiled code to state
    setCode(result.code);
  };

  return (
    <div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <pre>{code}</pre>
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector("#root"));
