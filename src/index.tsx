import React from "react";
import ReactDOM from "react-dom/client";
import "bulmaswatch/cyborg/bulmaswatch.min.css";
import { Provider } from "react-redux";
import { store } from "./state/store";
import CellList from "./components/cell-list";

const App = () => {
  return (
    <Provider store={store}>
      <div>
        <CellList />
      </div>
    </Provider>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<App />);
