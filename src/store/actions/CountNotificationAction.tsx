// actions/TranslationActionTypes.ts
import { createAction } from '@reduxjs/toolkit';

export const CountNotificationActionTypes = {
  CHANGE_COUNT_NOTIFICATION: 'CHANGE_COUNT_NOTIFICATION',
}

export const changeNotificationCount = createAction<string>(CountNotificationActionTypes.CHANGE_COUNT_NOTIFICATION);
