import { createSlice } from '@reduxjs/toolkit';
import travelData from '../travel/index.json';
import lifeData from '../life/termLife/index.json';

export const policySlice = createSlice({
    name: 'policy',
    initialState: {
        policy: JSON.parse(JSON.stringify(travelData)),
        lifePolicy: JSON.parse(JSON.stringify(lifeData)),
        payMethod: 'WeChat'

    },
    reducers: {
        setPolicy: (state, action) => {
            state.policy = action.payload;
        },
        setPayMethod: (state, action) => {
            state.payMethod = action.payload;
        },
        resetPolicy: (state) => {
            state.policy = JSON.parse(JSON.stringify(travelData))
        },
        setLifePolicy: (state, action) => {
            state.lifePolicy = action.payload;
        },
        resetLifePolicy: (state) => {
            state.lifePolicy = JSON.parse(JSON.stringify(lifeData))
        }
    }
})

// Action creators are generated for each case reducer function
export const { setPolicy, setPayMethod, resetPolicy, setLifePolicy, resetLifePolicy } = policySlice.actions;

export default policySlice.reducer;
