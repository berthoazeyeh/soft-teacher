import { createReducer, PayloadAction } from '@reduxjs/toolkit';
import { PURGE } from 'redux-persist';
import { SynchronisationAction } from 'store/actions';

export interface SynchroisationState {
  mustSyncingFistTime: boolean;
  bannerMessageindex: number
  bannerMessage: string
}

const initialState: SynchroisationState = {

  bannerMessageindex: 0,
  mustSyncingFistTime: true,
  bannerMessage: 'Synchronisation en cours...',

};


const SynchroisationReducer = createReducer(initialState, builder => {
  builder
    .addCase(SynchronisationAction.UPDATE_MESSAGE_INDEX, (state, action: PayloadAction<any>) => {
      state.bannerMessageindex = action.payload;
    })
    .addCase(SynchronisationAction.UPDATE_MESSAGE, (state, action: PayloadAction<any>) => {
      state.bannerMessage = action.payload;
    })
    .addCase(SynchronisationAction.UPDATE_SYNCING, (state, action: PayloadAction<any>) => {
      state.mustSyncingFistTime = action.payload;
    })
    .addCase(PURGE, () => {
      return {
        ...initialState,
      };
    });
});

export {
  SynchroisationReducer
}