import ReactDOM from "react-dom";
import "bulmaswatch/superhero/bulmaswatch.min.css";
// import CodeCell from "./components/code-cell";
// import TextEditor from "./components/text-editor";
import { Provider } from "react-redux";
import { store } from "./state";
import CellList from "./components/cell-list";

const App = () => {
  return (
    <Provider store={store}>
      <div>
        {/* Each CodeCell has 1 CodeEditor (monaco) and 1 Preview window (iframe) */}
        {/* <TextEditor /> */}
        <CellList />
      </div>
    </Provider>
  );
};

ReactDOM.render(<App />, document.querySelector("#root"));
