import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import reducers from "./reducers/reducers";
import bundlerMiddleware from "./middlewares/bundler-middleware";

export const store = configureStore({
  reducer: reducers,
  middleware: [bundlerMiddleware, thunk],
});
