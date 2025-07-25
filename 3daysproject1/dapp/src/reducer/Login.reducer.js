import { useState } from "react"

const initialState = {
    State: false,
    userId: null,
    user: null
};

export const LoginReducer = (state = initialState, action) => {
    const {type} = action;
    switch(type) {
        case "login": {
            return{...state, State: true};
        }
        case "logout" : {
            return{...state, State: false, userId: null, user: null};
        }
        case "setUserId": {
            return{...state, userId: action.payload};
        }
        case "setUser": {
            return{...state, user: action.payload};
        }
        default: {
            return state;
        }
    }
}

// Export the reducer function
export default LoginReducer;