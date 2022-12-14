import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "bulmaswatch/superhero/bulmaswatch.min.css";
import * as esbuild from "esbuild-wasm";
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";
import { fetchPlugin } from "./plugins/fetch-plugin";
import CodeEditor from "./components/code-editor";
import Preview from "./components/preview";

const App = () => {
  const [input, setInput] = useState("");
  const [code, setCode] = useState("");

  const startService = async () => {
    await esbuild.initialize({
      worker: true,
      wasmURL: "./esbuild.wasm" /*http://unpkg.com/esbuild-wasm/esbuild.wasm*/,
    });
  };

  useEffect(() => {
    startService();
  }, []);

  const onClick = async () => {
    let result = await esbuild.build({
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      define: {
        "process.env.NODE_ENV": '"production"',
        global: "window",
      },
    });

    setCode(result.outputFiles[0].text);
  };

  return (
    <div>
      <div>
        <CodeEditor
          onChange={(value) => {
            setInput(value || "");
          }}
          initialValue='console.log("Hi There");'
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
