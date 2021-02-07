import ReactDOM from "react-dom";
import "bulmaswatch/superhero/bulmaswatch.min.css";
import CodeCell from "./components/code-cell";

const App = () => {
  return (
    <div>
      {/* Each CodeCell has 1 CodeEditor (monaco) and 1 Preview window (iframe) */}
      <CodeCell />
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector("#root"));
