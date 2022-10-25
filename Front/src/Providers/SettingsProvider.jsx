import React, { useReducer } from "react";
import Reducers from "./Reducers";
import { CHANGE_SETTINGS } from "./types";

const settingsContext = React.createContext();

const SettingsProvider = (props) => {

    const initialState = { shid: [] }

    const [state, dispatch] = useReducer(Reducers,initialState);

    const changeSettings = (shid) => {
        let ids = [...state.shid]

        if (ids && ids.includes(shid)) {
            ids = ids.filter(id => id !== shid)
        } else if(ids && ids.length > 1){
            ids = ids.filter(id => id !== ids[0])
            ids[ids.length] = shid
        } else{
            ids[ids.length] = shid
        }

        try {
            dispatch({ type: CHANGE_SETTINGS, payload: { shid: ids } });
        } catch (error) { }
    };

    return (
        <settingsContext.Provider
            value={{
                shid: state.shid,
                changeSettings,
            }}
        >
            {props.children}
        </settingsContext.Provider>
    );
};

export { settingsContext, SettingsProvider };