


const initialState = null

export const NftsReducer = (state = initialState, action) => {
    const {type} = action;
    
    switch(type) {
        case "nftDatas" : {
            state = [...action.payload]
            console.log(state, "NftsReducer")
            return state
        }
        default : {
        // console.log(state, "default")
            return state
        }
    }
}