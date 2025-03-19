import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { SynchroisationState } from 'store/reducers/SynchroisationReducer';


const currentMessageIndex = createSelector(
  (state) => state.sync,
  (sync: SynchroisationState) => sync.bannerMessageindex,
);
const currentMessage = createSelector(
  (state) => state.sync,
  (sync: SynchroisationState) => sync.bannerMessage,
);
const currentSyncingVal = createSelector(
  (state) => state.sync,
  (sync: SynchroisationState) => sync.mustSyncingFistTime,
);



export const useCurrentBannerMessage = () => useSelector(currentMessage);
export const useCurrentBannerMessageIndex = () => useSelector(currentMessageIndex);
export const useMustSuncFirtTime = () => useSelector(currentSyncingVal);
