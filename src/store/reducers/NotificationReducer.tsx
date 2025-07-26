import { createReducer, PayloadAction } from '@reduxjs/toolkit';
import { PURGE } from 'redux-persist';
import { NotificationActionTypes, NotificationState, } from '@store/actions';
import { languages } from 'utils';

const initialState: NotificationState = {
  alert: true,
  cources: true,
  badging: true,
  update: true,
  time: 10
};


const NotificationReducer = createReducer(initialState, builder => {
  builder
    .addCase(NotificationActionTypes.CHANGE_NOTIFICTION, (state, action: PayloadAction<NotificationState>) => {
      state.alert = action.payload.alert;
      state.cources = action.payload.cources;
      state.badging = action.payload.badging;
      state.update = action.payload.update;
      state.time = action.payload.time;
    })
    .addCase(PURGE, () => {
      return {
        ...initialState,
      };
    });
});

export {
  NotificationReducer
}