import * as esbuild from "esbuild-wasm";
import { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";
import { fetchPlugin } from "./plugins/fetch-plugin";

const App = () => {
  const ref = useRef<any>();
  const [input, setInput] = useState("");
  const [code, setCode] = useState("");

  // use esbuild to transpile and bundle user's code
  const startService = async () => {
    // store the esbuild object into ref.current
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: "https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm",
    });
  };

  useEffect(() => {
    startService();
  }, []);

  const onClick = async () => {
    // ref.current is the esbuild object
    if (!ref.current) return;

    // get bundled code result from esbuild
    const result = await ref.current.build({
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      define: {
        "process.env.NODE_ENV": '"production"',
        global: "window",
      },
    });

    // store the bundled code into state
    setCode(result.outputFiles[0].text);
  };

  // prepare the bundled code to be executed in iframe
  const html = `
    <script>
      ${code}
    </script>
  `;

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
      {/* execute user's code inside an iframe - SAFER for parent react app */}
      {/* "sandbox" attr can disable direct js communication between parent and child iframe */}
      <iframe title="sandbox" sandbox="allow-scripts" srcDoc={html} />
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector("#root"));
