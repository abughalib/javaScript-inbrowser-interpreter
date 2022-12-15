import React from "react";
import ReactDOM from "react-dom/client";
import "bulmaswatch/cyborg/bulmaswatch.min.css";
import TextEditor from "./components/text-editor";

const App = () => {
  return (
    <div>
      <TextEditor />
    </div>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<App />);
