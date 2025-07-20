import { combineReducers } from "redux";
import LoginReducer from "./Login.reducer";
import { NftsReducer } from "./Nfts.reducer";
import { walletReducer } from "./wallet.reducer";




const combinedReducer = combineReducers({
    LoginReducer,
    NftsReducer,
    walletReducer
})


export default combinedReducer