import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { NotificationState } from 'store/actions';


const currentNotifSettings = createSelector(
  (state) => state.notif_settings,
  (notif_settings: NotificationState) => notif_settings,
);

export const useCurrentNotificationSettings = () => useSelector(currentNotifSettings);
