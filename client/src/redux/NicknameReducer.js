import {createSlice} from '@reduxjs/toolkit';

const INITIAL_STATE = {
    nickname: ''
};

const nicknameSlice = createSlice({
    name: 'nickname',
    initialState: INITIAL_STATE,
    reducers: {
        setNickname: (state, action) => ({
            ...state,
            nickname: action.payload
        }),
    },
});

export const {
    setNickname
} = nicknameSlice.actions;

export const nicknameReducer = nicknameSlice.reducer;
