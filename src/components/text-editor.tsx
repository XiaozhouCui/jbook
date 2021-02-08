import { useEffect, useRef, useState } from "react";
import MDEditor from "@uiw/react-md-editor";

const TextEditor: React.FC = () => {
  const [editing, setEditing] = useState(false);

  const ref = useRef<HTMLDivElement | null>(null);

  // click outside editor will close editing mode
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      // check if clicking inside editor
      if (
        ref.current &&
        event.target &&
        ref.current.contains(event.target as Node)
      ) {
        // console.log("element clicked on is inside editor");
        return;
      }

      // if clicked outside editor, close the editor
      setEditing(false);
    };
    document.addEventListener("click", listener, { capture: true });

    return () => {
      document.removeEventListener("click", listener, { capture: true });
    };
  }, []);

  // the opened md-editor, textarea input field
  if (editing) {
    return (
      <div ref={ref}>
        <MDEditor />
      </div>
    );
  }

  // the closed md-editor, only showing the markdown
  return (
    <div onClick={() => setEditing(true)}>
      <MDEditor.Markdown source={"# Header"} />
    </div>
  );
};

export default TextEditor;
