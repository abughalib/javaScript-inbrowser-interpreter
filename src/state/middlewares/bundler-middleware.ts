import { ActionType } from "../action-types/action_types";
import { Middleware } from "./middleware";
import bundler from "../../bundler/bundler";

let timer: NodeJS.Timer;

const bundlerMiddleware: Middleware =
  ({ getState, dispatch }) =>
  (next) =>
  (action) => {
    next(action);

    if (action.type !== ActionType.UPDATE_CELL) {
      return;
    }

    const { cells } = getState();
    const cell = cells!.data[action.payload.id];

    if (cell.type === "markdown") {
      return;
    }

    console.log(action);
    clearTimeout(timer);
    timer = setTimeout(async () => {
      const result = await bundler(action.payload.content);

      dispatch({
        type: ActionType.BUNDLE_CREATED,
        payload: {
          cellId: cell.id,
          bundle: result,
        },
      });
    }, 1000);
  };

export default bundlerMiddleware;
