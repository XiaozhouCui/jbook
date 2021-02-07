import { useEffect, useRef } from "react";
import "./preview.css";

// receive bundled code as props
interface PreviewProps {
  code: string;
}

// prepare the bundled code to be executed in iframe as srcDoc
const html = `
    <html>
      <head>
        <style>html { background-color: white; }</style>
      </head>
      <body>
        <div id="root"></div>
      </body>
      <script>
        window.addEventListener('message', (event) => {
          try {
            eval(event.data);
          } catch (err) {
            const root = document.querySelector('#root');
            root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>';
            console.error(err);
          }
        }, false)
      </script>
    </html>
  `;

const Preview: React.FC<PreviewProps> = ({ code }) => {
  const iframe = useRef<any>();

  useEffect(() => {
    // reset iframe html template when props "code" changes
    iframe.current.srcdoc = html;

    // emit a message event to pass data (bundled code) to iframe
    iframe.current.contentWindow.postMessage(code, "*");
    // inside iframe, an event listener is added to catch the data in message event
  }, [code]);

  // execute user's code inside an iframe - SAFER for parent react app
  // "sandbox" attr can disable direct js communication between parent and child iframe
  return (
    <div className="preview-wrapper">
      <iframe
        ref={iframe}
        title="preview"
        sandbox="allow-scripts"
        srcDoc={html}
      />
    </div>
  );
};

export default Preview;