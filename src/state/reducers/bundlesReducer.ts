import produce from "immer";
import { ActionType } from "../action-types/action_types";
import { Action } from "../actions/actions";

interface BundlesState {
  [key: string]: {
    code: string;
    err: string;
  } | undefined;
}

const initialState: BundlesState = {};

const reducer = produce(
  (state: BundlesState = initialState, action: Action): BundlesState => {
    switch (action.type) {
      case ActionType.BUNDLE_CREATED:
        state[action.payload.cellId] = action.payload.bundle;
        return state;
      default:
        return state;
    }
  }
);

export default reducer;
