import { useEffect, useRef } from "react";
import "./preview.css";

interface PreviewProps {
  code: string;
}

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

const Preview: React.FC<PreviewProps> = ({ code }) => {
  const iframe = useRef<any>();

  useEffect(() => {
    iframe.current.contentWindow.postMessage(code, "*");
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
    </div>
  );
};

export default Preview;
