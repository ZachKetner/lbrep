import React, { useEffect, useState, useReducer } from "react";
import { useImmerReducer } from "use-immer";

function Testing() {
    const initialState = {
        appleCount: 1,
        bananaCount: 10,
        message: "Hello",
        happy: false,
    };

    function ReducerFunction(draft, action) {
        switch (action.type) {
            case "addApple":
                draft.appleCount = draft.appleCount + 1;
                break;
        }
    }

    const [state, dispatch] = useImmerReducer(ReducerFunction, initialState);

    return (
        <>
            <div>Right Now the count of Apple is {state.appleCount}</div>
            <br />
            <button onClick={() => dispatch({ type: "addApple" })}>
                Add Apple
            </button>
        </>
    );
}

export default Testing;
