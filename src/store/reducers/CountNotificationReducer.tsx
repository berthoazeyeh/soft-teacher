import { createReducer, PayloadAction } from '@reduxjs/toolkit';
import { PURGE } from 'redux-persist';
import { CountNotificationActionTypes } from '@store/actions';


interface CountNotificationState {
  count: number;
}

const initialState: CountNotificationState = {
  count: 45, //
};


const CountNotificationReducer = createReducer(initialState, builder => {
  builder
    .addCase(CountNotificationActionTypes.CHANGE_COUNT_NOTIFICATION, (state, action: PayloadAction<number>) => {
      state.count = action.payload;
    })
    .addCase(PURGE, () => {
      return {
        ...initialState,
      };
    });
});

export {
  CountNotificationReducer
}