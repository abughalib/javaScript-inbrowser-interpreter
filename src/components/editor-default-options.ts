import monaco from 'monaco-editor';

export const editorOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
  wordWrap: "on",
  minimap: { enabled: false },
  folding: false,
  lineNumbersMinChars: 3,
  fontSize: 16,
  scrollBeyondLastLine: false,
  automaticLayout: true,
};
