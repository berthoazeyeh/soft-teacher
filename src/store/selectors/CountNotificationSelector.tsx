import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';

const Value = createSelector(
  (state) => state.notificationCount,
  (notificationCount) => notificationCount.count,
);

export const useNotificationCount = () => useSelector(Value);
