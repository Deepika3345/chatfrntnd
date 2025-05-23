import { configureStore } from "@reduxjs/toolkit";
import chatReducer from '../features/chattools/chatSlice'

const store = configureStore(
    {
        reducer: {
            chat: chatReducer

        }
    }
)
export default store