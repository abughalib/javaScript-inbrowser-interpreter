import { useSelector, TypedUseSelectorHook } from "react-redux";
import { RootState } from "../../state/state";

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
