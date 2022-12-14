import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "bulmaswatch/superhero/bulmaswatch.min.css";
import CodeEditor from "./components/code-editor";
import Preview from "./components/preview";
import bundler from "./builder/bundler";

const App = () => {
  const [input, setInput] = useState("");
  const [code, setCode] = useState("");

  const onClick = async () => {
    const output = await bundler(input);
    setCode(output);
    console.log(code);
  };

  return (
    <div>
      <div>
        <CodeEditor
          onChange={(value) => {
            setInput(value || "");
          }}
          initialValue="// Type your code here..."
        />
      </div>
      <button onClick={onClick}>Compile</button>
      <Preview code={code} />
    </div>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<App />);
