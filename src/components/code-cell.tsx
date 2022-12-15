import React, { useState } from "react";
import CodeEditor from "./code-editor";
import Preview from "./preview";
import bundler from "../builder/bundler";
import Resizable from "./resizable";

const CodeCell = () => {
  const [input, setInput] = useState("");
  const [code, setCode] = useState("");

  const onClick = async () => {
    const output = await bundler(input);
    setCode(output);
    console.log(code);
  };

  return (
    <Resizable direction="vertical">
      <div className="code-editor">
        <Resizable direction="horizontal">
          <CodeEditor
            onChange={(value) => {
              setInput(value || "");
            }}
            initialValue="// Type your code here..."
          />
        </Resizable>
        <Preview code={code} />
      </div>
    </Resizable>
  );
};

export default CodeCell;
