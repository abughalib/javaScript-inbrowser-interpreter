import Editor from "@monaco-editor/react";
import { editorOptions } from "./editor-default-options";

interface CodeEditorProps {
  initialValue: string;
  onChange(value: string | undefined): void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ onChange, initialValue }) => {
  return (
    <Editor
      onChange={onChange}
      height="80vh"
      theme="vs-dark"
      language="javascript"
      value={initialValue}
      options={editorOptions}
    />
  );
};

export default CodeEditor;
