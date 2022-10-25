import { CHANGE_SETTINGS } from "./types";

// eslint-disable-next-line import/no-anonymous-default-export
export default (state, action) => {
    const { payload, type } = action;

    switch (type) {
        case CHANGE_SETTINGS:
            return {
                ...state,
                shid: payload.shid,
            };
        default:
            return state;
    }
};