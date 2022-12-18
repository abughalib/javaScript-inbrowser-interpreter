import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import reducers from "./reducers/reducers";
import { ActionType } from "./action-types/action_types";

export const store = configureStore({
  reducer: reducers,
  middleware: [thunk],
});
