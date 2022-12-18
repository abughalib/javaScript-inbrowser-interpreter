import "./text-editor.css";
import { useState, useEffect, useRef } from "react";
import MDEditor from "@uiw/react-md-editor";
import { Cell } from "../state/cell";
import { useActions } from "./hooks/use-actions";

interface TextEditorProps {
  cell: Cell;
}

const TextEditor: React.FC<TextEditorProps> = ({ cell }) => {
  const [editing, setEditing] = useState(false);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const { updateCell } = useActions();

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
    updateCell(cell.id, text || " ");
  };

  if (editing) {
    return (
      <div className="text-editor" ref={editorRef}>
        <MDEditor value={cell.content} onChange={onChangeMarkDown} />
      </div>
    );
  }

  return (
    <div className="text-editor card">
      <div className="card-content" onClick={() => setEditing(true)}>
        <MDEditor.Markdown source={cell.content} />
      </div>
    </div>
  );
};

export default TextEditor;
