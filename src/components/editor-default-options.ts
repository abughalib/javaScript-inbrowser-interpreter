import monaco from 'monaco-editor';

export const editorOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
  wordWrap: "on",
  minimap: { enabled: false },
  folding: false,
  lineNumbersMinChars: 3,
  fontSize: 20,
  scrollBeyondLastLine: false,
  automaticLayout: true,
  tabSize: 2,
  formatOnPaste: true,
  formatOnType: true,
};
