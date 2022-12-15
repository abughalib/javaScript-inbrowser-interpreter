import { useEffect, useRef } from "react";
import "./preview.css";

interface PreviewProps {
  code: string;
  error: string;
}

let htmlContent = `
    <html>
        <head>
          <style> html {background-color: white; } </style>
        </head>
      <body>
        <div id="root"><i>Your output would be here...</i></div> 
        <script>
          const handleError = (err) => {
            let message = "<div style='font-size: 20px;'>Runtime Error</div><br/>"+err;
            console.error(message);
            throw err;
          }
          window.addEventListener('error', (event) => {
            event.preventDefault();
            handleError(event.error);
          });
          window.addEventListener('message', (event) => {
            try {
              eval(event.data);
            } catch (err) {
              handleError(err);
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

const Preview: React.FC<PreviewProps> = ({ code, error }) => {
  const iframe = useRef<any>();

  useEffect(() => {
    iframe.current.srcdoc = htmlContent;
    setTimeout(() => {
      iframe.current.contentWindow.postMessage(code, "*");
    }, 50);
  }, [code]);

  return (
    <div className="preview-wrapper">
      <iframe
        className="preview-frame"
        ref={iframe}
        sandbox="allow-scripts"
        title="result"
        srcDoc={htmlContent}
      />
      {error && (
        <div className="preview-error">
          <h1>Build Error</h1>
          <div className="error-message">{error}</div>
        </div>
      )}
    </div>
  );
};

export default Preview;
