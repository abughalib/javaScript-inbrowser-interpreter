import { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom/client";
import * as esbuild from "esbuild-wasm";
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";
import { fetchPlugin } from "./plugins/fetch-plugin";

const App = () => {
  const [input, setInput] = useState("");
  const [code, setCode] = useState("");
  const iframe = useRef<any>();

  const startService = async () => {
    await esbuild.initialize({
      worker: true,
      wasmURL: "./esbuild.wasm" /*http://unpkg.com/esbuild-wasm/esbuild.wasm*/,
    });
  };

  useEffect(() => {
    startService();
  }, []);

  let htmlContent = `
    <html>
        <head></head>
      <body>
        <div id="root">Hi There!</div>
        <script>
          window.addEventListener('message', (event) => {
            eval(event.data);
          })
        </script>
      </body>
    </html>
  `;

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

    iframe.current.contentWindow.postMessage(result.outputFiles[0].text, "*");
  };

  return (
    <div>
      <textarea onChange={(e) => setInput(e.target.value)}></textarea>
      <div>
        <button type="button" onClick={onClick}>
          Submit
        </button>
      </div>
      {/* <pre>{code}</pre> */}
      <iframe
        ref={iframe}
        sandbox="allow-scripts"
        title="result"
        srcDoc={htmlContent}
      ></iframe>
    </div>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<App />);
