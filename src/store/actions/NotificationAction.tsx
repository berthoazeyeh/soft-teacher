// actions/TranslationActionTypes.ts
import { createAction } from '@reduxjs/toolkit';
export interface NotificationState {
  alert: boolean;
  cources: boolean;
  badging: boolean;
  update: boolean;
  time: number
}
export const NotificationActionTypes = {
  CHANGE_NOTIFICTION: 'CHANGE_NOTIFICTION',
}

export const updateNotificationSettings = createAction<NotificationState>(NotificationActionTypes.CHANGE_NOTIFICTION);
