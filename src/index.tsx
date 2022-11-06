import { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import * as esbuild from "esbuild-wasm";
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";

const App = () => {
  const [input, setInput] = useState("");
  const [code, setCode] = useState("");

  const startService = async () => {
    await esbuild.initialize({
      worker: true,
      wasmURL: "./esbuild.wasm",
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
      plugins: [unpkgPathPlugin()],
    });

    setCode(result.outputFiles[0].text);
  };

  return (
    <div>
      <textarea onChange={(e) => setInput(e.target.value)}></textarea>
      <div>
        <button type="button" onClick={onClick}>
          Submit
        </button>
      </div>
      <pre>{code}</pre>
    </div>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<App />);
