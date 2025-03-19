import { createAction } from '@reduxjs/toolkit';

export const SynchronisationAction = {

  UPDATE_MESSAGE_INDEX: 'UPDATE_MESSAGE_INDEX',
  UPDATE_MESSAGE: 'UPDATE_MESSAGE',
  UPDATE_SYNCING: 'UPDATE_SYNCING',
}

export const updateBannerMessageIndex = createAction<any>(SynchronisationAction.UPDATE_MESSAGE_INDEX);
export const updateBannerMessage = createAction<any>(SynchronisationAction.UPDATE_MESSAGE);
export const updateSyncing = createAction<any>(SynchronisationAction.UPDATE_SYNCING);
