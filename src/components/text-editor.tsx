import "./text-editor.css";
import { useState, useEffect, useRef } from "react";
import MDEditor from "@uiw/react-md-editor";

const TextEditor: React.FC = () => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("# Header");
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (
        editorRef.current &&
        event.target &&
        !editorRef.current.contains(event.target as Node)
      ) {
        setEditing(false);
      }
    };
    document.addEventListener("click", listener, {
      capture: true,
    });

    return () => {
      document.removeEventListener("click", listener, { capture: true });
    };
  });

  const onChangeMarkDown = (text: string | any) => {
    setValue(text || "");
  };

  if (editing) {
    return (
      <div className="text-editor" ref={editorRef}>
        <MDEditor value={value} onChange={onChangeMarkDown} />
      </div>
    );
  }

  return (
    <div className="text-editor card">
      <div className="card-content" onClick={() => setEditing(true)}>
        <MDEditor.Markdown source={value} />
      </div>
    </div>
  );
};

export default TextEditor;
