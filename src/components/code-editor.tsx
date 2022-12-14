import "./code-editor.css";
import { useRef } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import { editorOptions } from "./editor-default-options";
import prettier from "prettier";
import parser from "prettier/parser-babel";
import { editor } from "monaco-editor";

interface CodeEditorProps {
  initialValue: string;
  onChange(value: string | undefined): void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ onChange, initialValue }) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor>();
  const onEditorDidMount: OnMount = (editor, _monaco) => {
    editorRef.current = editor;

  };

  const onFormatClick = () => {
    const unformatted = editorRef.current?.getValue() || "";

    const formatted = prettier.format(unformatted, {
      parser: "babel",
      plugins: [parser],
      useTabs: false,
      semi: true,
      singleQuote: true,
    });

    editorRef.current?.setValue(formatted);
  };

  return (
    <div className="editor-wrapper">
      <button
        className="button button-format is-primary is-small"
        onClick={onFormatClick}
      >
        Format
      </button>
      <Editor
        onChange={onChange}
        onMount={onEditorDidMount}
        height="100%"
        theme="vs-dark"
        language="javascript"
        value={initialValue}
        options={editorOptions}
      />
    </div>
  );
};

export default CodeEditor;
