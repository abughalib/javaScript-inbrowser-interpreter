import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom/client";
import "bulmaswatch/superhero/bulmaswatch.min.css";
import * as esbuild from "esbuild-wasm";
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";
import { fetchPlugin } from "./plugins/fetch-plugin";
import CodeEditor from "./components/code-editor";

const App = () => {
  const [input, setInput] = useState("");
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
        <div id="root"><i>Your output would be here...</i></div>
        <script>
          window.addEventListener('message', (event) => {
            try {
              eval(event.data);
            } catch (err) {
              let message = "<div style='font-size: 20px;'>Runtime Error</div>"+err;
              console.error(message);
              throw err;
            }
          })
        </script>
        <script>
          console = {
            log(message) {
              document.getElementById('root').innerHTML = message;
            },
            info(message) {
              document.getElementById('root').innerHTML = message;
              document.getElementById('root').style.color = 'orange';
            },
            error(message) {
              document.getElementById('root').innerHTML = message;
              document.getElementById('root').style.color = 'red';
            }
          }
        </script>
      </body>
    </html>
  `;

  const onClick = async () => {
    iframe.current.srcdoc = htmlContent;

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

    // setCode(result.outputFiles[0].text);
    iframe.current.contentWindow.postMessage(result.outputFiles[0].text, "*");
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
